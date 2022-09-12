require('dotenv').config();

const express=require("express");

const ejs=require("ejs");
const bodyparser=require("body-parser");
const encrypt=require("mongoose-encryption");
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
console.log(process.env.API_KEY);
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"] });
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
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })
});
app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username},function(err,founduser){
    if(err){
      console.log(err);
    }else{
      if(founduser.password===password){
        res.render("secrets");
      }
    }
  });
});

app.listen(3000,function(){
  console.log("server is runnnig on port 3000");
});
