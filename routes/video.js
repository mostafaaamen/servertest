import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import express from "express";
import multer from "multer";
import fs from "fs"
import {GenerateRandomNumbers}from "../functional/roundNumber.js"
import authenticate from "../middlewere/auth.js";

// import fs from "fs";
const app = express();
const router = Router();


// AWS.config.update({
//   accessKeyId: process.env.ACCESS_KEY,
//   secretAccessKey: process.env.SECRET_KEY,
//   region: process.env.REGION,
// });
// const BUCKET = process.env.BUCKET;
// const s3 = new AWS.S3();


const limits = {
  fileSize: 100 * 1024 * 1024, // 4 megabytes
};

const fileFilter = function (req, file, cb) {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Only MP4 files are allowed."));
  }
};
// 
function generateRandomNumbers(num) {
  var numbers = "";
  for (var i = 0; i < num; i++) {
    var randomNum = Math.floor(Math.random() * 10);
    numbers += randomNum;
  }
  return numbers;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "videos/");
  },
  filename: function (req, file, cb) {
 let number = Math.floor(Math.random() * 6) + 4;

 const ex = file.mimetype.slice(file.mimetype.indexOf("/")).replace("/", ".");

 cb(null, Date.now() + "-" + GenerateRandomNumbers(number) + ex);  },
});
const upload = multer({
  fileFilter: fileFilter,
  limits: limits,
  storage:storage,
});



router.post("/", authenticate, upload.single("file"), async (req, res) => {

  console.log(req.file);
  console.log(req.user.video);
 if (req.user.video === "null") {
   req.user.video = "/videos/" + req.file.filename;;
   await req.user.save();
       res.status(200).send("upload your video");

   console.log(true);
 } else {
   console.log(req.user.video);
   fs.unlink(`./${req.user.video}`, (err) => {
     if (!err) {
          req.user.video = "/videos/" + req.file.filename;
       req.user.save();
       res.status(200).send("video update success")
      
     } else {
    console.error("errrrr");
    res.status(503).send("error on upload video")
    console.error(err);
       return;
     }
     console.log(`File`);
    //  console.log(req.file);
   });
 }
});

export default router;
