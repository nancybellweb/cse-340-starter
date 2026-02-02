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
    accountController.registerAccount
)
router.post(
    "/login",
    utilities.handleErrors(accountController.loginAccount)
)


module.exports = router

