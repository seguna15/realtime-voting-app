import app from "./app.js"
import { createServer } from "http";
import { Server } from "socket.io";
import cookie from "cookie";



const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket, ) => {
  console.log(`${socket.id} user just connected`);
  console.log(cookie.parse(socket.request.headers.cookies || "No cookie"));

  socket.on("sendVote", (data) => {
    console.log(data);
    io.emit("voteResult", data);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export default httpServer;



