import app from "./app.js"
import { createServer } from "http";
import { Server } from "socket.io";


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket, ) => {
  
  
  socket.on("sendVote", (data) => {
    if(data){
      
      io.emit("voteResult", data);
    }
    
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export default httpServer;



