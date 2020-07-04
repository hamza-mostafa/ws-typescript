"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
const PORT = process.env.PORT || 8989;
const server = http.createServer();
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // record the message in the database
        console.log('recevied: %s', message);
        // after recording the message acknowledge receiving it
        ws.send({ seen: 'false' });
    });
});
server.listen(PORT, () => {
    console.log(`Server start on port ${PORT} `);
    console.log(`Server ${server.address()} `);
});
//# sourceMappingURL=server.js.map