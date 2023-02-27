import express from 'express'
const router = express.Router()
import { body, Result, validationResult } from 'express-validator';
import bodyParser from "body-parser";
import mysql from ".././sqlConnect.js";
import bcrypt from "bcrypt";
import passport from "passport";
import '.././googleSignup.js'
import dotenv from 'dotenv'
import session from 'express-session';
dotenv.config()

router.use(bodyParser.urlencoded({ extended: false }))

router.get("/signup", (req, res) => {
  res.render("register");
});

router.post("/signup",

  body('email').if(body('type').equals('signup')).isEmail().normalizeEmail().withMessage("Not a Valid Email"),
  body('password').if(body('type').equals('signup')).not().isEmpty().trim().escape(),
  body('firstname').if(body('type').equals('signup')).not().isEmpty().trim().escape(),
  body('lastname').if(body('type').equals('signup')).not().isEmpty().trim().escape(),
  body('phone').if(body('type').equals('signup')).not().isEmpty().trim().escape().isNumeric(),

  body('otp').if(body('type').equals('otp')).not().isEmpty().trim().escape().isNumeric(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(errors.array()[0].msg);
    }


    if (req.body.type == "otp") {
      const query = `SELECT * FROM sendotp WHERE email ='${req.body.email}' AND unique_key ='${req.body.key}'`
      mysql.query(query, (err, rows) => {
        if (err) {
          throw err
        } else {
          const OTP = rows[0].otp
          if (req.body.otp == OTP) {
            res.send({ otp: true })
          } else {
            res.send({ otp: false })
          }
        }
      })
    } else if (req.body.type == "signup") {
      bcrypt.hash(req.body.password, 12, (err, result) => {
        if (result) {
          const query = `INSERT INTO users(first_name, last_name, email, phone1, password) VALUES ('${req.body.firstname}','${req.body.lastname}','${req.body.email}',${req.body.phone}, '${result}')`
          mysql.query(query, (err) => {
            if (err) {
              throw err
            } else {
              const quer = `DELETE FROM sendotp WHERE email = '${req.body.email}'`
              mysql.query(quer, (err) => {

                if (err) {
                  throw err
                  return false
                } else {
                  res.send({ success: true })
                }
              })
            }
          })
        }
      })
    }
  })

// ! Google OAuth

router.use(session({
  secret: process.env.COOKIE_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

router.use(passport.initialize());
router.use(passport.session());


// Auth
router.get('/signup/google', passport.authenticate('googleSignup', {
  scope:
    ['email', 'profile']
}));

// Auth Callback
router.get('/signup/google/callback',
  passport.authenticate('googleSignup', {
    successRedirect: '/signup/google/callback/success',
    failureRedirect: '/signup/google/callback/failure'
  }));

// Success
router.get('/signup/google/callback/success', (req, res) => {
  const query = `SELECT * FROM users WHERE email = '${req.user.email}'`
  mysql.query(query, (err, result) => {
    if (result == '') {
      req.session.email = req.user.email
      req.session.firstname = req.user.given_name
      req.session.lastname = req.user.family_name
      res.render('googlePhone')

    } else {
      res.send("Account is Already Registered. Please Sign IN")
    }
  })
});

// failure
router.get('/signup/google/callback/failure', (req, res) => {
  res.redirect('http://localhost:5000/signup&googleAuthSuccess=false?')
})

router.post('/signup/google/data',
  body('phone').not().isEmpty().trim().escape().isNumeric(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(errors.array()[0].msg);
    }

    if (req.session.firstname && req.session.lastname && req.session.email) {
      const query1 = `SELECT COUNT(*) AS rowCount FROM users WHERE phone1 = ${req.body.phone}`
      mysql.query(query1, (err, result) => {
        if (result[0].rowCount == 0) {
          const query = `INSERT INTO users(first_name, last_name, email, phone1) VALUES('${req.session.firstname}','${req.session.lastname}','${req.session.email}','${req.body.phone}')`
          mysql.query(query, (err, result) => {
            if (result) {
              req.session.destroy(() => {
                res.send({ success: true })
              })

            } else {
              res.send("There was an error in processing your request")
            }
          })
        } else {
          res.send({ success: false, message: "Phone Number is Already Associated with a Different Account" })
        }
      })
    } else {
      res.send({ success: false, message: "Invalid Session. Please Start Over" })
    }
  })

export default router;