// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")



// login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to deliver registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration 
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
router.post(
    "/login",
    utilities.handleErrors(accountController.loginAccount)
)
// Process the logout
router.get("/logout", utilities.handleErrors(accountController.logout))

// Route to account management view
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount)
)
// Account Management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
)

// Deliver update view
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process account info update
router.post(
    "/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

// Process password update
router.post(
    "/update-password",
    utilities.checkLogin,
    regValidate.updatePasswordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
)

// Logout route
router.get(
    "/logout",
    utilities.checkLogin,
    utilities.handleErrors(accountController.logout)
)


module.exports = router

