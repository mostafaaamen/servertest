import Auth               from     "./auth.js              ";
import SignUp             from     "./signUp.js            ";
import profile            from     "./profile.js           ";
import avatar             from     "./avatar.js            ";
import contact            from     "./contact.js           ";
import Reset              from     "./reset.js             ";
import paypal_payment     from     "./order_paypal.js      ";
import card               from     "./card.js              ";
import orders             from     "./orders.js            ";
import subscribe          from     "./subscribe.js         "; 
import subscribePayment   from     "./subscribe_payment.js ";
import userId             from     "./userId.js            ";
import video              from     "./video.js             ";
import admin              from     "./admin.js             ";

export default function setupRoutes(app) {
  app.use("/api/signin", Auth);
  app.use("/api/signup", SignUp);
  app.use("/api/profile", profile);
  app.use("/api/avatar", avatar);
  app.use("/api/contact", contact)
  app.use("/api/reset", Reset);
  app.use("/api/create-order", paypal_payment);
  app.use("/api/card", card);
  app.use("/api/orders", orders);
  app.use("/api/subscribe", subscribe);
  app.use("/api/subscribe/payment", subscribePayment);
  app.use("/api/user", userId);
  app.use("/api/video", video);
  app.use("/api/admin", admin);
}