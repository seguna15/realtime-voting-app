import express from "express";
import {createServer} from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import cors from "cors";
import fetchVotes from "./fetchVotes.js";

const app = express();
const httpServer = createServer(app);
dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 4001;

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"]
    }
});

io.on("connection", (socket) => {
  socket.on("sendVote", async (data) => {
    if (data) {
      const result = await fetchVotes();
      io.emit("voteResult", result);
    }
  });

  socket.on("disconnect", () => {
    
  });
});



httpServer.listen(PORT, () => console.log(`Socket listening on ${PORT}`))