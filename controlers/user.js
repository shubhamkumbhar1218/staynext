const User = require("../models/user.js");
const mongoose = require("mongoose");

//get route
module.exports.userIndex = (req, res) => {
    res.render("users/signup");
};

//post route
module.exports.postRoute = async (req, res) => {
    try {
        let { username, email, password} = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listing");
        });
    } 
    catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

//login route
module.exports.loginIndex = (req, res) => {
    res.render("users/login.ejs");
};

//login post route
module.exports.loginRoute = async(req, res) => {
        req.flash("success", "User Logged!");
        let redirectUrl = res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
};

//logout route
module.exports.logoutRoute = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "User logout");
        res.redirect("/listing");
    });
};