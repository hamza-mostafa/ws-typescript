"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const users_model_1 = require("./database/users/users.model");
const database_1 = require("./database/database");
const app = express();
const PORT = process.env.PORT || 8989;
const server = http.createServer();
const wsServerPrivate = new WebSocket.Server({ server, clientTracking: true });
const wsServerChannel = new WebSocket.Server({ noServer: true, clientTracking: true });
const wsServerChannelPrivate = new WebSocket.Server({ noServer: true, clientTracking: true });
const wsServerBroadcast = new WebSocket.Server({ noServer: true, clientTracking: true });
const model = new users_model_1.UserModel;
server.on('upgrade', (request, socket, head) => {
    database_1.connect();
    const pathname = request.url;
    if (pathname === '/') {
        wsServerBroadcast.handleUpgrade(request, socket, head, (ws) => {
            let id = Math.ceil(Math.random() * 10);
            // @ts-ignore
            let userId = model.findByUserId(id);
            ws.id = userId;
            ws.on('message', (message) => {
                wsServerBroadcast.clients.forEach(x => {
                    x.send(JSON.stringify({ acknowledged: 'channel broadcast true' }));
                });
            });
            wsServerChannelPrivate.emit('connection', ws, ws.send(JSON.stringify({ connectionId: userId })));
        });
    }
    else if (pathname.match(/\/[a-z0-9]+\/[0-9]+/gi)) {
        // match channel/id
        wsServerChannelPrivate.handleUpgrade(request, socket, head, (ws) => {
            let id = Math.ceil(Math.random() * 10);
            let ch;
            // @ts-ignore
            let user = model.findByUserId(id).select('userId');
            let userId = user.userId;
            ws.id = userId;
            // @ts-ignore
            let senderRegisteredChannels = model.getChannels(userId).select('channelsId');
            ws.on('message', (message) => {
                let messageR = JSON.parse(message);
                ch = messageR.channelId;
                // @ts-ignore
                let receiverRegisteredChannels = model.getChannels(messageR.receiverId).select('channelsId');
                if (senderRegisteredChannels.filter((y) => receiverRegisteredChannels.includes(y))) {
                    wsServerChannelPrivate.clients.forEach(x => {
                        // @ts-ignore
                        if (x.id == messageR.receiverId) {
                            x.send('you have received a private message from ' + user.userId);
                        }
                    });
                }
            });
            wsServerChannelPrivate.emit('connection', ws, ws.send(JSON.stringify({ connectionId: userId })));
        });
    }
    else if (pathname.match(/\/[a-z0-9]+\/[0-9]+/gi)) {
        // match /id
        wsServerPrivate.handleUpgrade(request, socket, head, (ws) => {
            let id = Math.ceil(Math.random() * 10);
            let ch;
            // @ts-ignore
            let user = model.findByUserId(id).select('userId');
            let userId = user.userId;
            ws.id = userId;
            wsServerPrivate.on('message', (message) => {
                let messageR = JSON.parse(message);
                // @ts-ignore
                wsServerPrivate.clients.forEach(x => x.id === messageR.receiverId);
            });
            wsServerPrivate.emit('connection', ws, ws.send(JSON.stringify({ connectionId: userId })));
        });
    }
    else if (pathname.match(/(\/([a-z0-9]+))/gi)) {
        // match channel
        // get the channel subscribers
        wsServerChannel.handleUpgrade(request, socket, head, (ws) => {
            let id = Math.ceil(Math.random() * 10);
            let ch;
            // @ts-ignore
            let user = model.findByUserId(id).select('userId');
            let userId = user.userId;
            ws.id = userId;
            // @ts-ignore
            let registeredChannels = model.getChannels(userId);
            let concernedUsers;
            // @ts-ignore
            registeredChannels.forEach(x => concernedUsers.push(model.findByChannel(x)));
            ws.on('message', (message) => {
                ws.send(JSON.stringify({ acknowledged: 'channel true' }));
            });
            wsServerChannel.emit('connection', ws, ws.send(JSON.stringify({ connectionId: userId })));
        });
    }
    else {
        console.log('destroyed');
        socket.destroy();
        database_1.disconnect();
    }
});
server.listen(PORT, () => {
    console.log(`Server start on port ${PORT} `);
});
//# sourceMappingURL=server.js.map