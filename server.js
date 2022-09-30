require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require('bcrypt');
const encrypt = require('mongoose-encryption');
const saltRounds = 10;

const app = express();

mongoose.connect("mongodb://localhost:27017/loginDB");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.KEY, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    console.log("rendering index.ejs");
    res.render("index");
});

app.get("/signup", function(req, res){
    console.log("rendering signup");
    res.render("signup");
})

app.post("/signup", function(req, res){
    console.log("posting from signup");

    bcrypt.hash(req.body.newPassword, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.newEmail,
            password: hash
        });

        User.findOne({ email: req.body.newEmail}, function(err, user){
            if(err){
                console.log(err);
                console.log("error occured-------")
            }else {
                if(user != null){
                    console.log("Email address has already been used!");
                    res.render("signup");
                }else {
                    console.log("new user added to database!");
                    newUser.save();
                    res.redirect("/");
                }
            }
        });
    });
    
    

    

});

app.post("/", function(req, res){
    console.log("posting from root");
    const user_email = req.body.userEmail;
    const user_password = req.body.userPassword;

    User.findOne({ email: user_email}, function(err, user){
        if(err){
            console.log(err);
            console.log("Error occurred!");
        }
        else {
            if(user){
                bcrypt.compare(user_password, user.password, function(err, result){
                    if(result === true){
                        res.render("success");
                    }
                });
            }else {
                res.render("fail");
            }
        }
    });
});

app.listen("3000", function(){
    console.log("server is running on port 3000");
});