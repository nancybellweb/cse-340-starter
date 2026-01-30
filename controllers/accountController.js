const utilities = require("../utilities/")


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
    let nav = await utilities.getNav()
    const { account_firstname } = req.body

    // (database code to register the user would go here)
    // (database code to add the user to the database would go here)

    req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
        title: "Login",
        nav,
    })
}

module.exports = { buildLogin, buildRegister, registerAccount }




