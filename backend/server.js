import app from './app.js';
//import httpServer from './socket.js'
import connectDatabase from "./db/Database.js";
import * as dotenv from "dotenv";


//Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server for uncaughtException");
});


//config
if (process.env.NODE_ENV !== "PRODUCTION") {
   dotenv.config()
}

//connect db
connectDatabase();


const PORT = process.env.PORT;

//create Server
 app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
