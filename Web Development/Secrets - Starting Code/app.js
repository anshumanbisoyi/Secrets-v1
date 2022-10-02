require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5= require("md5");//hash package

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({ //made it mongoose schema
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password) //hashing the password
  });
  newUser.save(function(err) { //save will automatically encrypt
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
});
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = md5(req.body.password); //again hashing the password to check

  User.findOne({ //find will automatically decrypt
    email: username
  }, function(err, foundOne) {
    if (err) {
      console.log(err);
    } else {
      if (foundOne) {
        if (foundOne.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
