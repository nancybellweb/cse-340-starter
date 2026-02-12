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
 *  Process login request
 * ************************************ */
async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/account/")
        }
        else {
        req.flash("message notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}
async function buildAccountManagement(req, res) {
    const nav = await utilities.getNav()
    const accountData = res.locals.accountData

    res.render("account/management", {
        title: "Account Management",
        nav,
        accountData,
        errors: null
    })
}
async function buildUpdateAccount(req, res) {
    const nav = await utilities.getNav()
    const account_id = req.params.account_id
    const accountData = await accountModel.getAccountById(account_id)

    res.render("account/update", {
        title: "Update Account",
        nav,
        accountData,
        errors: null
    })
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, buildAccountManagement, buildUpdateAccount }



