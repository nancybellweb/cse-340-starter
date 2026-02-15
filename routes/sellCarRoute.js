//Routing layer for the sell car page

const express = require("express")
const router = new express.Router()
const sellCarController = require("../controllers/sellCarController")
const utilities = require("../utilities/")
const sellCarValidate = require("../utilities/sell-car-validation")

/* ============================
    USER ROUTES (logged-in users)
============================ */

// My Cars View - User's own sell car requests - both active and past
router.get(
    "/my-cars",
    utilities.checkLogin,
    utilities.handleErrors(sellCarController.buildMyCars)
)

// Sell Car Form View - Form to submit a new sell car request
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(sellCarController.buildSellCarForm)
)

// Process Sell Car Request -   Handle form submission for a new sell car request, including validation and saving to the database
router.post(
    "/submit",
    utilities.checkLogin,
    sellCarValidate.sellCarRules(),
    sellCarValidate.checkSellCarData,
    utilities.handleErrors(sellCarController.submitSellCarRequest)
)

/* ============================
    ADMIN ROUTES (Employee/Admin only)
============================ */

// Admin View - All Requests - View for employees/admins to see all sell car requests, with options to update status or delete requests
router.get(
    "/admin",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(sellCarController.buildAdminSellCarView)
)

// Update Request Status - Handle status updates for sell car requests (e.g., marking as approved, rejected, or sold)
router.post(
    "/admin/update-status",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(sellCarController.updateRequestStatus)
)

// Delete Request - Handle deletion of sell car requests by employees/admins, including removing the request from the database and any associated data
router.post(
    "/admin/delete",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(sellCarController.deleteRequest)
)

module.exports = router