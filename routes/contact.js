import { Router } from "express";
import { Contact } from "../model/contact.js";

const router = Router();

router.post("/", async (req, res) => {
    const { email, title, about } = req.body;
    if (!email) return res.status(401).send("email required");
    if (!title) return res.status(401).send("title required");
    if (!about) return res.status(401).send("about required");
    const contact = new Contact({ email, title, about });
    await contact.save(); 
    res.send("contact save we call on gmail")
    console.log("done");
    console.log(email);
    console.log(title);
    console.log(about);
});
export default router;