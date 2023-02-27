import passport from 'passport';
import Strategy from 'passport-google-oauth2'
const GoogleSignupStrategy = Strategy.Strategy
import dotenv from 'dotenv'
dotenv.config()

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('googleSignup', new GoogleSignupStrategy({
    clientID: process.env.OAUTH_CLIENT_ID_SIGNUP, 
    clientSecret: process.env.OAUTH_CLIENT_SECRET_SIGNUP, 
    callbackURL: "http://localhost:5000/signup/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));