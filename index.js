import dotenv from "dotenv"
dotenv.config()
import express from "express";
import setupRoutes from "./routes/index.js";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import cors from "cors"
// ########## use es6 to use __dirname ###################
import path from "path";                               //#
import { fileURLToPath } from "url";                   //#
const __filename = fileURLToPath(import.meta.url);     //#
const __dirname = path.dirname(__filename);            //#
// #######################################################
// #######################################################
//                      security
// 1- limit body qeury parmas
// use 



// #######################################################
const app = express()
mongoose.connect(process.env.MONGODB_CONTECTED).then(() => console.log("monodb connected"));
// 1 set request size
// limit ip address 
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    "Too many accounts created from this IP, please try again after an 5 min",
});
const limiterContact = rateLimit({
  windowMs: 6 *60 * 60 * 1000, // 6 hour
  max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    "Too many accounts created from this IP, please try again after an 6 hour",
});

// Apply the rate limiting middleware to all requests

app.use(express.json({limit:"50kb"}))
app.use(cors())
app.use("/images", express.static(__dirname + "/images"));
app.use("/cards", express.static(__dirname + "/cards"));
app.use("/videos", express.static(__dirname + "/videos"));

app.use("/api/reset", limiter);
app.use("/api/contact", limiterContact);

setupRoutes(app)
app.use(express.static("public"))
app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
})
const PORT=process.env.PORT ||5555
app.listen(PORT, (req, res) => {
  console.log("server done");
});
// ##############################################################################
//                              CREATED BY AZMOS 
// aws mlpoknmlpokn123!@#
// ##############################################################################
