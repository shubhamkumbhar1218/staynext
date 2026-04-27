if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utility/ExpressError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

main()
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const sessionOption = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expiry: Date.now() + 7 * 24 *60 * 60 * 1000,
        maxAge: 7 * 24 *60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/",userRouter);

//privacy & terms routes
app.get("/privacy", (req, res) => res.render("listings/privacy"));
app.get("/terms", (req, res) => res.render("listings/terms"));

//Middlewares
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res ,next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    console.log(statusCode);
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000, () => {
    console.log("Server is listining on port 3000");
});  
