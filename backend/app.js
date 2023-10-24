import express from "express";
import ErrorHandler from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import cors from "cors";



const app = express();



//middlewares

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
//app.use("/", express.static("uploads"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000",],
    credentials: true,
  })
);
// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config();
}

//import routes
import authRoute from "./user/auth/auth.router.js";
import userRoute from "./user/user.router.js";

const API_VERSION = process.env.API_VERSION;

app.use(`${API_VERSION}/auth`, authRoute);
app.use(`${API_VERSION}/user`, userRoute);

//For ErrorHandling
app.use(ErrorHandler);
export default  app;
