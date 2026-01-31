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



module.exports = { buildLogin, buildRegister, registerAccount }




