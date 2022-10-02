require('dotenv').config(); //for env variables
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //added
var saltRounds=10; //number of rounds to salt
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

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash //hashing the password with saltrounds
    });
    newUser.save(function(err) { //save will automatically encrypt
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password; //again hashing the password to check

  User.findOne({email: username}, function(err, foundOne) {
    if (err) {
      console.log(err);
    } else {
      if (foundOne) {
        bcrypt.compare(password, foundOne.password, function(err, result) { //to validate the passowrd
           if(result === true){
             res.render("secrets");
           }
         });
      }
    }
  });
});








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
