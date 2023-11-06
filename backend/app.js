import express from "express";
import ErrorHandler from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import path from 'path';
import cors from "cors";

const __dirname = path.resolve();

const app = express();

//middlewares

app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use(express.json({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
//app.use("/", express.static("uploads"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config();
}

//import routes
import authRoute from "./user/auth/auth.routes.js";
import userRoute from "./user/user.routes.js";
import candidateRoute from "./candidates/candidates.routes.js"
import voteRoute from "./votes/votes.routes.js";

const API_VERSION = process.env.API_VERSION;

app.use(`${API_VERSION}/auth`, authRoute);
app.use(`${API_VERSION}/user`, userRoute);
app.use(`${API_VERSION}/candidate`, candidateRoute);
app.use(`${API_VERSION}/vote`, voteRoute);

//For ErrorHandling
app.use(ErrorHandler);
export default  app;
