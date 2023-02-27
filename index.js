/***********************************
 * 
 * Imports for Functionalities
 * 
 **********************************/

import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'
import session from "express-session";



/***********************************
 * 
 * Object Declarations for Imports
 *
 **********************************/

var app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
dotenv.config()

/***********************************
 * 
 * Setting Express Global Values
 * 
 ***********************************/

app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "/public")));


/***********************************
 * 
 * Main Express Code
 * 
 ***********************************/

// *Route Declarations

import loginRoute from './routes/loginRoute.js'
import signupRoute from './routes/signupRoute.js'
import emailController from './Controllers/emailController.js'
import resetRoute from './routes/resetRoute.js'

// *Express Routes


app.get("/", (req, res) => {
  res.render("index")
});

app.post("/", (req, res) => {
  res.render("error", { message: "You Cannot Use POST Method on This Page!", code: 405 })
  res.status(405)
})

app.use(loginRoute)
app.use(signupRoute)
app.use(resetRoute)

//* Controllers

app.use(emailController)

app.listen(5000);
