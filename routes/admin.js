import { Router } from "express";
import multer from "multer";

// middlewares
import authenticate from "../middlewere/auth.js";
import authorizeAdmin from "../middlewere/admin.js";
// schema
import { User } from "../model/users.js";
import { Card } from "../model/cards.js";
import { Order } from "../model/orders.js";
import { Subscribe } from "../model/subscribe.js";
import { TransacrionSubscriptions } from "../model/transaction-subscriptions.js";
import { TransAcrion } from "../model/transaction-paypal.js";
import { Contact } from "../model/contact.js";

// functions
import {PriceSubscribe}from "../functional/priceSubscribe.js"
import { PriceOrder } from "../functional/priceOrder.js";
import { ConnectPrice } from "../functional/connectPrice.js";
import { totalPriceSubscribe } from "../functional/totalPriceSubscribe.js";
import { totalPriceCards } from "../functional/totalPriceOrder.js";

const router = Router();
// return country count number form array
 const getCountReturn = (array) => {
   const count = {};
   for (let i = 0; i < array.length; i++) {
     if (count[array[i]]) {
       count[array[i]]++;
     } else {
      count[array[i]] = 1;
     }
   }
   return count;
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "cards");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
// ##############################################################################
// ##############################################################################
router.get("/deteles", authenticate, authorizeAdmin, async (req, res) => {
  const user = await User.find()
    const validUsers = user.filter((user) => user.userAuth !== "true");
  const order = await Order.find();
  const subscribeTransActions = await TransacrionSubscriptions.find();
  const contact = await Contact.find();
  const country = order.map((obj) => obj.address[0].country);
  const filteredCountry = country.filter((value) => value !== undefined);

  const lowercaseCountry = filteredCountry.map((c) => c.toLowerCase()); 
      const data = {
        userNum: validUsers.length,
        countryCount: getCountReturn(lowercaseCountry),
        orderNum: order.length,
        contactNum: contact.length,
        subscribeNum: subscribeTransActions.length,
        totalOrder: totalPriceCards(order),
        totalSubscribe: totalPriceSubscribe(subscribeTransActions),
        totalSub:
          totalPriceCards(order) + totalPriceSubscribe(subscribeTransActions),
      };    
    res.send(data);
});
// ##############################################################################
router.get("/deteles/visual", authenticate, authorizeAdmin, async (req, res) => {
  const subscriptions = await TransacrionSubscriptions.find();
  const order = await Order.find();
  const data = ConnectPrice(PriceSubscribe(subscriptions), PriceOrder(order));
  const toArrayVisual = (object) => {
    const dataArray = [];
    Object.entries(object).forEach(([key, value]) => {
      dataArray.push({ name: key, Total: value });
    });
    return dataArray;
  };
  res.send(toArrayVisual(data));

});
router.get("/show/contact", authenticate, authorizeAdmin, async (req, res) => {
  const contact = await Contact.find();
  res.send(contact)
});
router.get("/show/contact/:id", authenticate, authorizeAdmin, async (req, res) => {
  const _id = req.params.id;
  if (_id.length != 24) return res.status(404).send("Error on URl");
  const contact = await Contact.findById(_id);
  if (!contact) return res.status(403).send("user not found");
  return res.send(contact);
});
router.delete("/delete/contact/:id", authenticate, authorizeAdmin, async (req, res) => {
  const _id = req.params.id;
  console.log(_id)
    if (_id.length != 24) return res.status(404).send("Error on URl");
    try {
      const deleteContact = await Contact.findByIdAndDelete(_id);
      if (!deleteContact) return res.status(404).send( "contact not found" );
      res.send( "contact deleted successfully" );
    } catch (error) {
      res.status(500).send( "An error occurred" );
    }
});
// ##############################################################################
// ##############################################################################
router.get("/users", authenticate, authorizeAdmin, async (req, res) => {
  const users = await User.find()
  const validUsers = users.filter((user) => user.userAuth !== "true");
  if (validUsers) return res.status(201).send(validUsers)
  return res.send({massage:"users not found"});
});
router.get("/users/:id", authenticate, authorizeAdmin, async (req, res) => {
   const _id = req.params.id;
   if (_id.length != 24) return res.status(404).send("Error on URl");
   const user = await User.findById(_id);
   const paypal = await TransAcrion.find({user:_id});
  const subscribe = await TransacrionSubscriptions.find({ user: _id });
  const order = await Order.find({user: _id});
  if (!user) return res.status(403).send("user not found");
   const data = ConnectPrice(PriceSubscribe(subscribe), PriceOrder(order));
   const toArrayVisual = (object) => {
     const dataArray = [];
     Object.entries(object).forEach(([key, value]) => {
       dataArray.push({ name: key, Total: value });
     });
     return dataArray;
   };
  const dataUser = {
    user,
    paypal,
    subscribe,
    dataVisaul: toArrayVisual(data)
  };
  return res.send(dataUser);
});
router.post("/add/admin", authenticate, authorizeAdmin, async (req, res) => {
  const { email, password,username } = req.body
   if (!email) return res.status(401).send("Email is Required");
   if (!password) return res.status(401).send("Password is Required");
   if (!username) return res.status(401).send("Username is Required");
   if (password.length < 8)
     return res.status(406).send("The password is small ");
   const Email = email.toLowerCase();
  let emailFound = await User.findOne({ email:Email });
  if (emailFound)
    return res
      .status(404)
      .send("this email found in data base please try ather email");
  const user = new User({
    username,
    password,
    email,
    usersShow: 0,
    valid: null,
    experimental: true,
    created: Date(),
    userAuth: true,
    dataInfo: {},
    video: "null",
  });
  console.log(user);
  await user.save();
  res.status(202).send("create new admin")
})
router.get("/show/admin", authenticate, authorizeAdmin, async (req, res) => {
  const users = await User.find();
  const validUsers = users.filter((user) => user.userAuth !== "false");
  if (validUsers) return res.status(201).send(validUsers);
  return res.send({ massage: "users not found" });
});
router.delete(
  "/delete/admin/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const _id = req.params.id;
    if (_id.length != 24) return res.status(404).send("Error on URl");
    const mangerAdmin="balmbooms@gmail.com"
    try {
      const adminId = await User.findById(_id);
      if (adminId.email==mangerAdmin) return res.status(404).send("cann't deleted the manger");
        if (!adminId) {
          return res.status(404).send("Admin not found");
        }
       await User.findByIdAndDelete(_id);
       res.send("Admin deleted successfully");
      //
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
    
  }
);

// ################################## START #####################################
/*
                                     CARDS
              SHOW      CARDS                           ALL 
              ADD       CARDS                           
              UPDATE    CARDS                           BY ID
              DELETE    CARDS                           BY ID
                                __________________
                                |                 |
################################ CREATED BY AZMOS ################################
                                |_________________| 
*/ 
router.get("/show/cards", authenticate, authorizeAdmin, async (req, res) => {
  const cards = await Card.find();
  if(!cards)return res.send("cards not found")
  await res.status(201).send(cards);
});
router.post("/add/cards", authenticate,authorizeAdmin,upload.single("file"), async (req, res) => {
  const { title, price } = req.body;
     if (!title) return res.status(401).send("Title is Required");
     if (!price) return res.status(401).send("Price is Required");
         const createCard = new Card({
           price,
           title,
           img:"/cards/"+req.file.filename
         });
  await createCard.save();
  res.send("sucess to create card")
});

// update
router.post(
  "/update/card/:id",
  authenticate,
  authorizeAdmin,
  upload.single("file"),
  async (req, res) => {
    const { title, price } = req.body;
    const _id = req.params.id;
    if (_id.length != 24) return res.status(404).send("Error on URl");
    try {
      const updateSubscribe = await Card.findById(_id);
      if (!updateSubscribe) {
        return res.status(404).json({ message: "subscribe not found" });
      }
      updateSubscribe.price = price;
      updateSubscribe.title = title;
      updateSubscribe.img = "/cards/" + req.file.filename;
      await updateSubscribe.save();
      res.json({ message: "Card update successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
    return;
  }
);
// delete
router.delete("/delete/card/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const _id = req.params.id;
    
    if (_id.length != 24) return res.status(404).send("Error on URl");
    try {
      const cardId = await Card.findById(_id);
      if (!cardId) {
        return res.status(404).send( "Card not found" );
      }
      await Card.findByIdAndDelete(_id);
      res.send("Card deleted successfully" );
    } catch (error) {
      res.status(500).send( "An error occurred");
    }
  }
);
// ################################## END CARD #####################################
router.get("/subscribe", authenticate, authorizeAdmin, async (req, res) => {
  const subscriptions = await TransacrionSubscriptions.find();
  if (!subscriptions) return res.send("TransacrionSubscriptions not found");
  await res.status(201).send(subscriptions);
});
// ##############################################################################
// ##############################################################################
router.get("/show/subscribe", authenticate, authorizeAdmin, async (req, res) => {
  const subscribe = await Subscribe.find();
  if (subscribe) return res.status(201).send(subscribe);
  return res.send({ massage: "subscribe not found" });
});
router.post("/add/subscribe", authenticate, authorizeAdmin, async (req, res) => {
  const { title, price, month } = req.body;
  console.log(req.body)
       const createSubscribe = new Subscribe({
         price,
         title,
         month,
       });
  await createSubscribe.save();
  console.log(createSubscribe)
});
router.post("/update/subscribe/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { title, price, month } = req.body;
  const _id = req.params.id;
  if (_id.length != 24) return res.status(404).send("Error on URl");

  try {
       const updateSubscribe = await Subscribe.findById(_id);
       if (!updateSubscribe) {
         return res.status(404).send( "subscribe not found" );
       }
         updateSubscribe.price=price
         updateSubscribe.title = title;
         updateSubscribe.month=month
       await updateSubscribe.save();
    //    console.log(updateSubscribe);
      res.send( "User update successfully" );
    } catch (error) {
      res.status(500).send( "An error occurred" );
    }
    return
  });
  // delete
router.delete(
  "/delete/subscribe/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const _id = req.params.id;
    if (_id.length != 24) return res.status(404).send("Error on URl");
    try {
      const SubscribeId = await Subscribe.findById(_id);
      if (!SubscribeId) {
        return res.status(404).send( "Subscribe not found" );
      }
      await Subscribe.findByIdAndDelete(_id);
      res.send( "subscribe deleted s or successfully" );
    } catch (error) {
      res.status(500).send("An error occurred" );
    }
  }
);
// ##############################################################################
// ##############################################################################
router.get("/order", authenticate, authorizeAdmin, async (req, res) => {
  const order = await Order.find();
  if (order) return res.status(201).send(order);
  return res.send({ massage: "order not found" });
});
router.get("/order/:id", authenticate, authorizeAdmin, async (req, res) => {
  const _id = req.params.id;
  if (_id.length != 24) return res.status(404).send("Error on URl");
    const order = await Order.findById(_id);
  if (!order) return res.status(403).send("user not found");
  return res.send(order);
});
router.post("/order/:id/status", authenticate, authorizeAdmin, async (req, res) => {
  const { status } = req.body
  console.log(status);
  const _id = req.params.id;
  if (_id.length != 24) return res.status(404).send("Error on URl");
  const order = await Order.findById(_id);
  if (!order) return res.status(403).send("order not found");
  if(order.status==="successfully")return res.status(405).send("finsh set status , status now is successfully");
  const data = ["sendding", "successfully"];
  if (data.includes(status)) {
    order.status = status;
    await order.save()
    res.send("updata to : " + status)
  }
});
export default router;
// ##############################################################################
//                              CREATED BY AZMOS 
//            #mostafa => linkedIn https://www.linkedin.com/in/mostafaamen/
// ##############################################################################
