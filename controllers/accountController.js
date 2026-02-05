const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
* Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ****************************************
* Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null, 
    })// if I need to pass errors, I can do it here
}
/* ****************************************
* Process Registration
* *************************************** */
async function registerAccount(req, res) {
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    let nav = await utilities.getNav()

    // Hash the password before storing it to database - salt is generated automatically
    let hashedPassword
    try {
        // regular password and cost of 10
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration.")
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        })
        return
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash("notice", "Congratulations, you are registered. Please log in.")
        res.redirect("/account/login")
    } else {
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        })
    }
    }

/* ****************************************
* Process Login
* *************************************** */
async function loginAccount(req, res) {
    const { account_email, account_password } = req.body
    let nav = await utilities.getNav()

    // Get account data by email
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", "Invalid email or password.")
        return res.status(400).render("account/login", {
        title: "Login",
        nav,
        account_email
        })
    }

    // Compare password
    const match = await bcrypt.compare(account_password, accountData.account_password)

    if (!match) {
        req.flash("notice", "Invalid email or password.")
        return res.status(400).render("account/login", {
        title: "Login",
        nav,
        account_email
        })
    }
    // Login successful, set session variables
    
    req.session.loggedin = true
    req.session.accountData = accountData

    req.flash("notice", "You are now logged in.")
    return res.redirect("/account/")
}


module.exports = { buildLogin, buildRegister, registerAccount, loginAccount }



