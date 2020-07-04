const express = require('express') ;
const WebSocket = require("ws");
const  { v4: uuid } = require( "uuid");
const http = require("http");


const app = express();

const PORT = process.env.PORT || 8989;

const server = http.createServer();

const wsServerPrivate = new WebSocket.Server({server, clientTracking: true});

wsServerPrivate.on('connection', (ws) =>{
    let id = 'cnx: '+uuid();
    ws.id = id;
    ws.send(JSON.stringify({receiverId: id}));
    wsServerPrivate.clients.add(ws);
    ws.ping('I, thank you',undefined, () => true);
    ws.ping('O, thank you',undefined, () => true);
    ws.on('message', (message) => {
        ws.send(JSON.stringify({acknowledged: 'main!'}))
        let messageR = JSON.parse(message)
        wsServerPrivate.clients.forEach(x => {
        if(x.id === messageR.receiverId){
            x.send(JSON.stringify({message: messageR.body}))
        }else if(x.id === id){
            x.send(JSON.stringify({message: "Papa"}))
        }else{
            x.send(JSON.stringify({message: "Mama"}))
        }

        })
    });
});

server.listen(PORT, () => {
    console.log(`Server start on port ${PORT} `)
})

