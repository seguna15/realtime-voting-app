import express from "express";
import {createServer} from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 4001;

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on('connection', (socket, req) => {
    console.log(`${socket.id} user just connected`);
    console.log(req);

    socket.on('sendVote', (data) => {
        console.log(data)
        io.emit('voteResult', data);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
})



httpServer.listen(PORT, () => console.log(`Socket listening on ${PORT}`))