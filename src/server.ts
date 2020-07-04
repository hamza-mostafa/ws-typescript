import * as express from 'express';
import * as http from 'http';
import * as WebSocket from "ws";
import {v4 as uuid} from "uuid";
import { UserModel } from "./database/users/users.model";
import { connect, disconnect } from "./database/database";
import {IUserModel} from "./database/users/users.types";


const app = express();

const PORT = process.env.PORT || 8989;

const server = http.createServer();

const wsServerPrivate = new WebSocket.Server({server, clientTracking: true});
const wsServerChannel = new WebSocket.Server({noServer: true, clientTracking: true});
const wsServerChannelPrivate = new WebSocket.Server({noServer: true, clientTracking: true});
const wsServerBroadcast = new WebSocket.Server({noServer: true, clientTracking: true});

const model = new UserModel;

server.on('upgrade', (request, socket, head) => {
    connect();
    const pathname = request.url;

    if (pathname === '/') {

        wsServerBroadcast.handleUpgrade(request, socket, head, (ws) => {
            let id = Math.ceil(Math.random()*10);
            // @ts-ignore
            let userId = model.findByUserId(id);
            (ws as any).id = userId;
            ws.on('message',(message: string) =>{
                wsServerBroadcast.clients.forEach(x => {
                x.send(JSON.stringify({acknowledged: 'channel broadcast true'}))
                })
            })
            wsServerChannelPrivate.emit('connection', ws, ws.send(JSON.stringify({connectionId: userId})));
        });

    } else if (pathname.match(/\/[a-z0-9]+\/[0-9]+/gi)) {
        // match channel/id
        wsServerChannelPrivate.handleUpgrade(request, socket, head, (ws) => {
            let id = Math.ceil(Math.random()*10);
            let ch: string;
            // @ts-ignore
            let user = model.findByUserId(id).select('userId')
            let userId = user.userId;
            (ws as any).id = userId;
            // @ts-ignore
            let senderRegisteredChannels = model.getChannels(userId).select('channelsId')


            ws.on('message',(message: string) =>{
                let messageR: {body: string, channelId:string, receiverId: string }  = JSON.parse(message)
                ch = messageR.channelId;
                // @ts-ignore
                let receiverRegisteredChannels = model.getChannels(messageR.receiverId).select('channelsId')
                if(senderRegisteredChannels.filter((y:string) => receiverRegisteredChannels.includes(y))){
                    wsServerChannelPrivate.clients.forEach(x => {
                        // @ts-ignore
                        if(x.id == messageR.receiverId){
                            x.send('you have received a private message from '+user.userId)
                        }
                    })
                }
            })
            wsServerChannelPrivate.emit('connection', ws, ws.send(JSON.stringify({connectionId: userId})));
        });
    } else if (pathname.match(/\/[a-z0-9]+\/[0-9]+/gi)) {
        // match /id
        wsServerPrivate.handleUpgrade(request, socket, head, (ws) => {
            let id = Math.ceil(Math.random()*10);
            let ch: string;
            // @ts-ignore
            let user = model.findByUserId(id).select('userId')
            let userId = user.userId;
            (ws as any).id = userId;
                
            wsServerPrivate.on('message', (message: string) => {
                let messageR: {body: string, receiverId: string }  = JSON.parse(message)
                // @ts-ignore
                wsServerPrivate.clients.forEach(x => x.id === messageR.receiverId)
            });
            wsServerPrivate.emit('connection', ws, ws.send(JSON.stringify({connectionId: userId})));
        });
    } else if (pathname.match(/(\/([a-z0-9]+))/gi)) {
        // match channel
        // get the channel subscribers
        wsServerChannel.handleUpgrade(request, socket, head, (ws) => {
            let id = Math.ceil(Math.random()*10);
            let ch: string;
            // @ts-ignore
            let user = model.findByUserId(id).select('userId')
            let userId = user.userId;
            (ws as any).id = userId;
            // @ts-ignore
            let registeredChannels = model.getChannels(userId)
            let concernedUsers: IUserModel[];
            // @ts-ignore
            registeredChannels.forEach(x => concernedUsers.push(model.findByChannel(x)))
            ws.on('message', (message: string) => {
                ws.send(JSON.stringify({acknowledged: 'channel true'}))
            });
            wsServerChannel.emit('connection', ws, ws.send(JSON.stringify({connectionId: userId})));
        });
    } else {
        console.log('destroyed');
        socket.destroy();
        disconnect();
    }
});

server.listen(PORT, () => {
    console.log(`Server start on port ${PORT} `)
})
