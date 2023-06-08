import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import express from "express"
const app=express()
const router = Router();

import {GenerateRandomNumbers}from "../functional/roundNumber.js"
import authenticate from "../middlewere/auth.js";


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type. Only JPEG and PNG files are allowed.');
    error.code = 'LIMIT_FILE_TYPES';
    return cb(error, false);
  }
  cb(null, true);
};
const limits = {
  fileSize: 5 * 1024 * 1024, 
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    // 
    let number = Math.floor(Math.random() * 6) + 4;
    const ex = file.mimetype.slice(file.mimetype.indexOf("/")).replace("/", ".");
    cb(null, Date.now() + "-" + GenerateRandomNumbers(number) + ex);  
    // 
  },
});

const upload = multer({
  fileFilter: fileFilter,
    limits: limits,
  storage: storage,
});

router.post("/", authenticate, upload.single("file"), async (req, res) => {
 if (req.user.img === "/Images/avatar.png") {
   req.user.img = "/Images/" + req.file.filename;
   await req.user.save();
  res.status(200).send("upload your avatar")
 } else {
   console.log("req.user.img");
   console.log(req.user.img);
  //  console.log(__dirname);
   fs.unlink(`./${req.user.img}`, (err) => {
     if (err) {
       console.error(err);
       return;
     }
     console.log(`File`);
     console.log(req.file);
     req.user.img = "/Images/" + req.file.filename;
    req.user.save();
    res.status(200).send("update your avatar")

   });
 }});


export default router;
