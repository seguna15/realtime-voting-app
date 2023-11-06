import {createServer} from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { fetchVoteStats } from "./votes/vote.service.js";


const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"]
    }
});

io.on("connection", (socket) => {
  console.log(`Connected on ${socket.id}`);
  socket.on("sendVote", async (data) => {
    if (data) {
      const result = await fetchVoteStats();
      io.emit("voteResult", result);
    }
  });

  socket.on("disconnect", () => {
    console.log(`disconnected on ${socket.id}`)
  });
});


export default httpServer;