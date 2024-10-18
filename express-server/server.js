const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const WebSocketServer = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

const app = express();
app.use(cors( ));
app.use(express.json());


export const httpServer = createServer(app);

export const wss = new WebSocketServer({server: httpServer})

function onError(error) {
  console.log(error);
}

function onListening() {
  console.log("Listening")
}

httpServer.on('error', onError);
httpServer.on('listening', onListening);

wss.on('connection', (ws, req) => {
  console.log("wss:connection");
  setupWSConnection(ws, req);
})
