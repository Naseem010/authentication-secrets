require('dotenv').config();

const express=require("express");

const ejs=require("ejs");
const bodyparser=require("body-parser");
const bcrypt=require("bcrypt");
const saltRounds=10;
const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});


const User=mongoose.model("User",userSchema);
app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser=new User({
      email:req.body.username,
      password:hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    })
});

});
app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username},function(err,founduser){
    if(err){
      console.log(err);
    }else{
      bcrypt.compare(password,founduser.password, function(err, result) {
    // result == true
    if(result===true){
    res.render("secrets");
  }
});
}
  });
});

app.listen(3000,function(){
  console.log("server is runnnig on port 3000");
});
