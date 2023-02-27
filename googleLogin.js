import passport from 'passport';
import Strategy from 'passport-google-oauth2'
const GoogleLoginStrategy = Strategy.Strategy
import dotenv from 'dotenv'
dotenv.config()


passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('googleLogin', new GoogleLoginStrategy({
    clientID: process.env.OAUTH_CLIENT_ID_LOGIN,
    clientSecret: process.env.OAUTH_CLIENT_SECRET_LOGIN,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));
