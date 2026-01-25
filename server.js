/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const inventoryRoute = require("./routes/inventoryRoute")
const app = express()
const static = require("./routes/static")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
// before doing anything else, the nav partial must be created and saved to res.locals (global bypass in order to view the nav on all pages) "Global Middleware
// Global Navigation Middleware 

app.use(async (req, res, next) => {
  const utilities = require("./utilities/")
  const nav = await utilities.getNav()
  res.locals.nav = nav
  next()
})

app.use(static)

// Inventory routes
app.use("/inv", inventoryRoute)

/* ***********************
 * Index route
 *************************/
app.get("/", baseController.buildHome)

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
