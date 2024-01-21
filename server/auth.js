const passport = require("passport");
const GoogleUserSchema = require("./googleUserSchema");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const dotenv = require('dotenv');
dotenv.config();

passport.use(new GoogleStrategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/google/callback",
        passReqToCallback   : true,
    },
    function(request, accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        GoogleUserSchema.findOne({googleId: profile.id}).then((user) => {
            if(!user){
                const newGoogleUser = GoogleUserSchema.create({googleId: profile.id, name : profile.displayName, email : profile.email});
                return done(null, newGoogleUser);
            }else{
                return done (null, user);
            }
        })
    }
));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});