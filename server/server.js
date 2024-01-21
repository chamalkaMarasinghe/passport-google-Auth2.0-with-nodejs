const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const dotenv = require('dotenv');
require("./auth");
dotenv.config();

const app = express();
app.use(session({ secret : "cats"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}));
app.use(cors());
app.use(cors({
    origin: ["*"],
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
}));

const isLoggedIn = (req, res, next) => {
    req.user? next() : res.sendStatus(401);
};

app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Sign in with google<a/>");
});

app.get("/auth/google", 
    passport.authenticate("google", {scope :['email', 'profile']})
);

app.get("/google/callback",
    passport.authenticate("google", {
        successRedirect : "/protected",
        failureRedirect : "/auth/failed"
    })
);

app.get("/protected", isLoggedIn, (req, res) => {
    res.send("this is the protected content");
});

app.get("/auth/failed", (req, res) => {
    res.send("authentication failed");
});

mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(3001, () => {console.log(`server running on port ${3001}`);})
    })
    .catch((err) => {console.log(err);});


// http://localhost:3001/google/callback

/**
 * client id : 
 * client secret : 
 * git config --global --replace-all user.email "chamalkamarasinghe11@gmail.com"
 * git config --global user.name "chamalkaMarasinghe"
 * A 
 **/