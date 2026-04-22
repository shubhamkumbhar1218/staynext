const express = require("express");
const wrapAsync = require("../utility/wrapAsync");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js")

const userController = require("../controlers/user.js");

router.get("/signup", userController.userIndex);

//signup route
router.post("/signup", wrapAsync (userController.postRoute));

router.get("/login", userController.loginIndex);

//login form 
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}),
    userController.loginRoute);

//logout route
router.get("/logout", userController.logoutRoute);

module.exports = router;