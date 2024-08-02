require('dotenv').config();
const express= require ("express");
const app = express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride = require ("method-override"); // cannot use put patch, delete request directly soo it is used 
const ejsmate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const listings= require("./route/listing.js");
const reviews= require("./route/review.js");
const userRoute= require("./route/user.js");
const user= require("./models/user.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const passport= require("passport");
const LocalStrategy= require("passport-local");
const flash= require("connect-flash");
const store=MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto:{
        secret:"mysecretcode",
    },
    touchAfter: 3600*24,
});
const sessionOption= { 
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true //
    },
};

app.listen(8080,()=>{
    console.log("listening on port 8080");
});
async function main(){
    await mongoose.connect(process.env.MONGO_URI); //database connection
}main().then(()=>{
    console.log("connected db");
}).catch((err)=>{
    console.log(err);
});

app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.curruser= req.user;
    next();
});


app.use(express.static(path.join(__dirname,"/public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);

app.use("/listing", listings);
app.use("/listing/:id/review", reviews);
app.use("/",userRoute);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"))
});
app.use((err,req,res,next)=>{
    let {statuscode=500, message="something went wrong!"}=err;
    res.status(statuscode).render("error.ejs", {message});
    //res.status(statuscode).send(message);
});

