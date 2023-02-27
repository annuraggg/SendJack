import express from 'express'
const router = express.Router()
import bcrypt from "bcrypt";
import mysql from ".././sqlConnect.js";
import passport from "passport";
import cookieSession from "cookie-session";
import { body, validationResult } from 'express-validator';
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import session from 'express-session';
import '.././googleLogin.js'
dotenv.config()


router.use(bodyParser.urlencoded({ extended: false }))

router.get("/login", (req, res) => {
    res.render("login");

    if (req.query.googleAuthSuccess == false) {
        res.send({ message: "Something Went Wrong", loggedIn: false })
    }

    if (req.query.googleAuthValid == false) {
        res.send({ message: "The Associated Google Account is Not Registered", loggedIn: false })
    }
});

router.post("/login",
    body('email', { message: "Please Enter a Valid Email Format!", loggedIn: false, }).isEmail().normalizeEmail().withMessage(),
    body('password', { message: "Please Enter a Valid Password!", loggedIn: false, }).isLength({ min: 5 }).not().isEmpty().trim().escape(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send(errors.array()[0].msg);
        }

        let query1 = `SELECT COUNT(*) AS rowCount FROM users WHERE email= '${req.body.email}'`;
        let query = `SELECT * FROM users WHERE email= '${req.body.email}'`
        mysql.query(query1, (err, rows) => {
            if (err) throw err;
            if (rows[0].rowCount == 1) {
                mysql.query(query, (err, rows) => {
                    if (err) throw err;
                    else {
                        bcrypt.compare(req.body.password, rows[0].password, (err, result) => {
                            if (err) throw err;
                            if (result) {
                                res.send({
                                    message: "Encrypted Password Matches",
                                    loggedIn: true,
                                });
                            } else {
                                res.send({
                                    message: "Username or Password is Incorrect",
                                    loggedIn: false,
                                });
                            }
                        });
                    }
                });
            } else {
                res.send({
                    message: "Username or Password is Incorrect",
                    loggedIn: false,
                });
            }
        });
    });



// ! GOOGLE AUTH / OAuth 2.0

router.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

router.use(passport.initialize());
router.use(passport.session());


// Auth
router.get('/auth/google', passport.authenticate('googleLogin', {
    scope:
        ['email', 'profile']
}));

// Auth Callback
router.get('/auth/google/callback',
    passport.authenticate('googleLogin', {
        successRedirect: '/auth/google/callback/success',
        failureRedirect: '/auth/google/callback/failure'
    }));

// Success
router.get('/auth/google/callback/success', (req, res) => {
    const query = `SELECT * FROM users WHERE email = '${req.user.email}'`
    mysql.query(query, (err, result) => {
        if (result != '') {
            res.send(`Welcome,  ${req.user.email}`)
        } else {
            res.redirect('http://localhost:5000/login?googleAuthSuccess=true&googleAuthValid=false')
        }
    })
});

// failure
router.get('/auth/google/callback/failure', (req, res) => {
    res.redirect('http://localhost:5000/login&googleAuthSuccess=false?')
})

export default router