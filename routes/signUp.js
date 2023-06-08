import { Router } from "express";
import { User } from "../model/users.js";
const router = Router();
router.post("/",  async (req, res) => {
  const { username, password, email } = req.body;
    if (!email) return res.status(401).send("Email is Required");
    if (!password) return res.status(401).send("Password is Required");
    if (!username) return res.status(401).send("Username is Required");
    if (password.length < 8 ) return res.status(406).send("The password is small ");
  const Email=email.toLowerCase()
  let emailFound = await User.findOne({ email:Email });
  if (emailFound)
    return res.status(404).send("This email is taken, try to log in");
  const user = new User({
    username,
    password,
    email:Email,
    usersShow: 0,
    valid: false,
    experimental: true,
    created: Date(),
    userAuth: false,
    dataInfo: {},
    video:"null"
  });
  // console.log(user);
  await user.save();
  res.send(user.getToken());
  // console.log(username, password, email);
});

// router.get('/test',authenticate, (req, res) => {
//     res.send({ message: `Hello, ${req.user.username}!` });

// })


export default router;
