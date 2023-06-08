import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
let SEC = "thistakenoutfixion6@5!2!@@_)";
let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 3,
    max: 25,
  },
  password: {
    type: String,
    require: true,
    min: 8,
    max: 300,
  },
  userAuth: {
    type: String,
    default: false,
  },
  email: {
    type: String,
  },
  video: {
    type: String,
  },
  img: {
    type: String,
    default: "/Images/avatar.png",
  },
  links: [],
  valid: Boolean,
  validDate: String,
  show: Boolean,
  cards: Number,
  dataInfo: [],
  showInfo: {
    type: {},
    default: {
      name1: "",
      name2: "",
      name3: "",
      name4: "",
    },
  },
  locationInfo: {
    type: {},
    default: {
      data1: "",
      data2: "",
      data3: "",
    },
  },
  usersShow: Number,
  experimental: Boolean,
  endExperimental: {
    type: {},
    default: {
      dateNum: 0,
      dateStr: "",
      dateMilli: 0,
    },
  },
  created: String,
});


UserSchema.pre("save",async function (next) {
    let salt=await bcrypt.genSalt(10)
    let hashed =await bcrypt.hash(this.password, salt)
    this.password=hashed
    next()
})

UserSchema.methods.getToken = function () {
    return jwt.sign(this.toJSON(),SEC );
};
UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("user", UserSchema);
// const User = new mongoose.model("user", UserSchema);
