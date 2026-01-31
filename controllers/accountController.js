const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model")



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

    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        res.redirect("/account/login")
    } else {
        res.render("account/register", { title: "Register", errors: null })
    }
}


module.exports = { buildLogin, buildRegister, registerAccount }




