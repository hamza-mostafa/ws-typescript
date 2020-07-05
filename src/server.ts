import * as express from 'express';
import * as http from 'http';
import * as WebSocket from "ws";
import { UserModel } from "./database/users/users.model";
import { connect, disconnect } from "./database/database";
import {IUserDocument} from "./database/users/users.types";




const app = express();

const PORT = process.env.PORT || 8989;

const server = http.createServer();


const wsServer = new WebSocket.Server({server, clientTracking: true});
server.on('upgrade', (request, socket, head) => {
    connect();
    console.log('working')

    wsServer.on('connection', async(ws) => {
        // @ts-ignore
        let user:UserModel = await UserModel.findByUserId(id);
        let userId = user.userId;
        (ws as any).id = userId;
        ws.send(JSON.stringify({connectionId: userId}));
        ws.on('message',async (message: string) =>{
            let messageR: {
                body: string,
                channelId:string|boolean|any,
                receiverId: string|boolean,
                broadcast: boolean
            }  = JSON.parse(message)


            if(messageR.broadcast){
                console.log('broadcast')
                wsServer.clients.forEach(x => {
                    x.send(JSON.stringify({acknowledged: 'channel broadcast true'}))
                })
            }else{
                console.log('channels and private')
               if(messageR.channelId){
                   // channels
                   console.log('channels')
                   let ch: string = messageR.channelId as string;
                   let senderRegisteredChannels:IUserDocument[] = await UserModel.getChannels(userId)
                   let receiverRegisteredChannels:IUserDocument[] = await UserModel.getChannels(messageR.receiverId as string)

                   if(messageR.receiverId) {
                       console.log(senderRegisteredChannels);
                       // channel private
                       // @ts-ignore
                       if ((senderRegisteredChannels as unknown as string[])[0].channelsId.filter(
                           // @ts-ignore
                           (y: string) => (receiverRegisteredChannels as unknown as string[])[0].channelsId.includes(y))) {
                           wsServer.clients.forEach((x: WebSocket) => {
                               // @ts-ignore
                               if (x.id == messageR.receiverId) {
                                   x.send('you have received a private message from ' + userId+' on channel '+ch)
                               }
                           })
                       }
                   }else{
                       console.log('channels public')
                       // channel public
                       let concernedUsers:IUserDocument[] = await UserModel.findByChannel(messageR.channelId);
                       let x = await UserModel.find()
                       concernedUsers.forEach(
                           (x:IUserDocument) =>{
                               wsServer.clients.forEach((y:WebSocket) =>
                               {
                                   // @ts-ignore
                                   if(x.userId == y.id){
                                       y.send('you received this message because you are on channel '+ch)
                                   }
                               })
                           })
                   }
               // end of channels
               }else{
                   console.log('private conversation')
                   // private conversation
                   wsServer.clients.forEach((x:WebSocket) =>{
                       // @ts-ignore
                       console.log(x.id)
                           // @ts-ignore
                           x.id === messageR.receiverId?
                               x.send(JSON.stringify({body: messageR.body, senderId: userId})):''
                   });
               }
            }
        });

        ws.on('error', () => {
            disconnect();
        })

    });
});

server.listen(PORT, () => {
    console.log(`Server start on port ${PORT} `)
});
