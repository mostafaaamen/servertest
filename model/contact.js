import mongoose from "mongoose";

let ContactSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  title: {
    type: String,
    require: true,
  },
  about: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Contact = mongoose.model("contact", ContactSchema);
