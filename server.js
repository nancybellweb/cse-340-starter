/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const bodyParser = require("body-parser")
const utilities = require("./utilities/") //for error handler use
const baseController = require("./controllers/baseController")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const inventoryRoute = require("./routes/inventoryRoute")
const app = express()
const static = require("./routes/static")
const session = require("express-session")
const pool = require('./database/')
const flash = require('connect-flash')
const accountRoute = require('./routes/accountRoute')
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,           // Changed to false (standard for pg-simple)
  saveUninitialized: false, // Keep as false
  name: 'sessionId',
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: false, // MUST be false for localhost (HTTP)
    httpOnly: true,
  },
}))

// Express Messages Middleware
app.use(flash()) // Usinng the variable instead of requiring it here
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/

// before doing anything else, the nav partial must be created and saved to res.locals (global bypass in order to view the nav on all pages) "Global Middleware
// Global Navigation Middleware 

app.use(async (req, res, next) => {
  // const utilities = require("./utilities/") <--- Removed THIS because the require statement is now at the top of the file
  const nav = await utilities.getNav()
  res.locals.nav = nav
  next()
})


app.use(static)

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

/* ***********************
 * Index route
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome))
//checkJWTToken
app.use(utilities.checkJWTToken)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
