const user= require("../models/user");

module.exports.signupForm=(req,res)=>{
    res.render("signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
     let {username, email,password}=req.body;
     const newuser= new user({
         email,
         username
     })
     const registedUser = await user.register(newuser,password);
     req.login(registedUser, (err)=>{
         if(err){
             return next(err);
         }
         req.flash("success","Registered Successfully!");
     res.redirect("/listing");
     })
    }catch(e){
     req.flash("error",e.message);
     res.redirect("/signup");
    }
};
module.exports.loginForm=(req,res)=>{
    res.render("login.ejs");
};
module.exports.login=(req, res) => {
    req.flash('success', 'Welcome back!');
    let redirectUrl= res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl); // Redirect to a route that exists
};
module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you're logged out");
        res.redirect("/listing");
    });
};