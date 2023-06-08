import { Router } from "express";
import authenticate from "../middlewere/auth.js";
import { User } from "../model/users.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  req.user.password = undefined;
  res.send(req.user);
});
router.post("/add/socail", authenticate, async (req, res) => {
  const {  instgram } = req.body;
  const data = {
    instgram,
  };
  const userId = req.user._id;
    const user = await User.findById(userId)
     user.links = data;
     user.save();
       res.status(200).send("success added or update link")


  });
router.post("/add/address", authenticate, async (req, res) => {
    const { phone, city, address, country } = req.body;
    const data = {
      phone,
      city,
      address,
      country,
    };
    const userId = req.user._id;
    const user = await User.findById(userId);
  user.dataInfo = data
  user.save()
  console.log(user)
    res.status(200).send("success added or update address");

});
router.post("/add/showInfo", authenticate, async (req, res) => {
  const { name1, name2, name3, name4 } = req.body;
  if (
    name1.length > 30 ||
    name2.length > 30 ||
    name3.length > 30 ||
    name4.length > 30
  ) {
    res
      .status(402)
      .send("Error to match length number max length is 30 character");
  } else {
    const data = {
      name1,
      name2,
      name3,
      name4,
    };
    const userId = req.user._id;
    const user = await User.findById(userId);
    user.showInfo = data;
    await user.save();
      res.status(200).send("success added or update data show on ar");

  }
});
router.post("/add/location", authenticate, async (req, res) => {
  console.log(req.body)
  const { location1,location2,location3,location4, } = req.body;
  console.log(req.body)
    const data = {
      location1,
      location2,
      location3,
      location4,
    };
    const userId = req.user._id;
    const user = await User.findById(userId);
    user.locationInfo = data;
  await user.save();
  res.status(200).send("success added or update locations")

});
export default router;
