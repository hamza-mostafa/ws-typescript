import * as http from 'http';
import * as WebSocketServerAdapter from "./HelperClasses/WebSocketServerAdapter";
import { UserModel } from "./database/users/users.model";
import { connect, disconnect } from "./database/database";
import {IUserDocument} from "./database/users/users.types";
import {receivedMessage} from "./general.types"


const PORT = process.env.PORT || 8989;

const server = http.createServer();

// need to add the try and catch for each that have at least 2 types
const wsServer = new WebSocketServerAdapter.AdjustedServer({server, clientTracking: true});
    connect();

    wsServer.on('connection', async(ws: WebSocketServerAdapter) => {
        // @ts-ignore
        let user:UserModel = await UserModel.findByUserId(id);
        let userId = user.userId;
        wsServer.clientsMapped.set(userId,ws);
        ws.send(JSON.stringify({connectionId: userId}));
        ws.on('message',async (message: string) =>{
            let messageReceived: receivedMessage = JSON.parse(message)

            if(messageReceived.broadcast){
                wsServer.clients.forEach(x => {
                    x.send(JSON.stringify({acknowledged: 'channel broadcast true'}))
                })

            }else{
               if(messageReceived.channelId){
                   // channels
                   let ch: string = messageReceived.channelId as string;
                   let senderRegisteredChannels:IUserDocument[] = await UserModel.getChannels(userId)
                   let receiverRegisteredChannels:IUserDocument[]|boolean = (typeof messageReceived.receiverId === 'boolean')?false:await UserModel.getChannels(messageReceived.receiverId);

                   if(messageReceived.receiverId) {
                       // channel private
                       let includedInListOfChannels = (typeof (senderRegisteredChannels)[0].channelsId === "boolean")?
                           false : ((senderRegisteredChannels)[0].channelsId).filter(
                               // @ts-ignore
                           (y: string) => ((receiverRegisteredChannels)[0].channelsId as string[]).includes(y));
                       if (includedInListOfChannels) {
                           fetcherSender(wsServer, messageReceived.receiverId as string, 'you have received a private message from ' + userId+' on channel '+ch)
                       }
                   }else{
                       // channel public
                       let concernedUsers:IUserDocument[] = await UserModel.findByChannel(messageReceived.channelId);
                       concernedUsers.forEach(
                           (x:IUserDocument) =>{
                               fetcherSender(wsServer, x.userId as string, 'you received this message because you are on channel ' + ch)
                           })
                   }
               // end of channels
               }else{
                   // private conversation
                   fetcherSender(wsServer, messageReceived.receiverId as string, JSON.stringify({body: messageReceived.body, senderId: userId}))
               }
            }
        });

        ws.on('error', () => {
            disconnect();
        })

    });

server.listen(PORT, () => {
    console.log(`Server start on port ${PORT} `)
});

function fetcherSender(server: WebSocketServerAdapter.AdjustedServer, rid: string, message: string){
    let x:WebSocketServerAdapter | undefined = server.clientsMapped.get(rid as string);
    if(x !== undefined){
        x.send(message)
    }
}
