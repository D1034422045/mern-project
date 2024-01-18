const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
// Heroku 設定
const path = require("path");
const port = process.env.PORT || 8080;

// Heroku 設定
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// 連結 MongoDB
// mongoose
//   .connect("mongodb://127.0.0.1:27017/mernDB")
//   .then(() => {
//     console.log("連結到mongodb...");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Heroku 設定
app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/api/user", authRoute);
// course route 應該被 jwt 保護
// 如果 request header 內部沒有 jwt，則 request 就會被視為是 unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

// Heroku 設定
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// Heroku 設定
app.listen(port, () => {
  console.log("後端伺服器聆聽在port 8080.....");
});

// app.listen(8080, () => {
//   console.log("後端伺服器聆聽在port 8080.....");
// });
