"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const users_model_1 = require("./database/users/users.model");
const database_1 = require("./database/database");
const app = express();
const PORT = process.env.PORT || 8989;
const server = http.createServer();
const wsServer = new WebSocket.Server({ server, clientTracking: true });
server.on('upgrade', (request, socket, head) => {
    database_1.connect();
    console.log('working');
    wsServer.on('connection', (ws) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        let user = yield users_model_1.UserModel.findByUserId(id);
        let userId = user.userId;
        ws.id = userId;
        ws.send(JSON.stringify({ connectionId: userId }));
        ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
            let messageR = JSON.parse(message);
            if (messageR.broadcast) {
                console.log('broadcast');
                wsServer.clients.forEach(x => {
                    x.send(JSON.stringify({ acknowledged: 'channel broadcast true' }));
                });
            }
            else {
                console.log('channels and private');
                if (messageR.channelId) {
                    // channels
                    console.log('channels');
                    let ch = messageR.channelId;
                    let senderRegisteredChannels = yield users_model_1.UserModel.getChannels(userId);
                    let receiverRegisteredChannels = yield users_model_1.UserModel.getChannels(messageR.receiverId);
                    if (messageR.receiverId) {
                        console.log(senderRegisteredChannels);
                        // channel private
                        // @ts-ignore
                        if (senderRegisteredChannels[0].channelsId.filter(
                        // @ts-ignore
                        (y) => receiverRegisteredChannels[0].channelsId.includes(y))) {
                            wsServer.clients.forEach((x) => {
                                // @ts-ignore
                                if (x.id == messageR.receiverId) {
                                    x.send('you have received a private message from ' + userId + ' on channel ' + ch);
                                }
                            });
                        }
                    }
                    else {
                        console.log('channels public');
                        // channel public
                        let concernedUsers = yield users_model_1.UserModel.findByChannel(messageR.channelId);
                        let x = yield users_model_1.UserModel.find();
                        concernedUsers.forEach((x) => {
                            wsServer.clients.forEach((y) => {
                                // @ts-ignore
                                if (x.userId == y.id) {
                                    y.send('you received this message because you are on channel ' + ch);
                                }
                            });
                        });
                    }
                    // end of channels
                }
                else {
                    console.log('private conversation');
                    // private conversation
                    wsServer.clients.forEach((x) => {
                        // @ts-ignore
                        console.log(x.id);
                        // @ts-ignore
                        x.id === messageR.receiverId ?
                            x.send(JSON.stringify({ body: messageR.body, senderId: userId })) : '';
                    });
                }
            }
        }));
        ws.on('error', () => {
            database_1.disconnect();
        });
    }));
});
server.listen(PORT, () => {
    console.log(`Server start on port ${PORT} `);
});
//# sourceMappingURL=server.js.map