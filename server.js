const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

mongoose.connect("mongodb://localhost:27017/loginDB");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = {
    email: String,
    password: String
};

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
    const newEmail = req.body.newEmail;
    const newPassword = req.body.newPassword;
    
    const newUser = new User({
        email: newEmail,
        password: newPassword
    });

    User.findOne({ email: newEmail}, function(err, user){
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

app.post("/", function(req, res){
    console.log("posting from root");
    const user_email = req.body.userEmail;
    const user_password = req.body.userPassword;

    User.findOne({ email: user_email, password: user_password}, function(err, user){
        if(err){
            console.log(err);
            console.log("Error occurred!");
        }
        else {
            if(user != null){
                console.log("Logging in!");
                res.render("success");
            }else {
                res.render("fail");
            }
        }
    });
});

app.listen("3000", function(){
    console.log("server is running on port 3000");
});