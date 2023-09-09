import { WebSocketServer } from 'ws'
import express from 'express'

const app = express();
const wsServer = new WebSocketServer({ noServer: true });

app.use(express.static('frontend/build'))

const users = new Set();

function sendMessage(message) {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}

wsServer.on('connection', (ws) => {
    const userRef = { ws }
    users.add(userRef)
    ws.on('message', (message) => {
        console.log(message);
        try {
            const data = JSON.parse(message);
            if (typeof data.sender !== 'string' || typeof data.body !== 'string') {
                console.error('Invalid message');
                return
            }

            const messageToSend = {
                sender: data.sender,
                body: data.body,
                sendAt: Date.now()
            }

            sendMessage(messageToSend)
        } catch (e) {
            console.error('Error parsing message', e)
        }
    });
    ws.on('close', (code, reason) => {
        users.delete(userRef);
        console.log(`Connection closed: ${code} ${reason}!`);
    })
});

const server = app.listen(8080);

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});