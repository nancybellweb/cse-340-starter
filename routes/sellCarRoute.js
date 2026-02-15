//Routing layer for the sell car page

const express = require("express")
const router = new express.Router()
const sellCarController = require("../controllers/sellCarController")
const utilities = require("../utilities/")
const sellCarValidate = require("../utilities/sell-car-validation")

/* ============================
    USER ROUTES (logged-in users)
============================ */

// My Cars View - User's own sell car requests
router.get(
    "/my-cars",
    utilities.checkLogin,
    utilities.handleErrors(sellCarController.buildMyCars)
)

// Sell Car Form View
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(sellCarController.buildSellCarForm)
)

// Process Sell Car Request
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

// Admin View - All Requests
router.get(
    "/admin",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(sellCarController.buildAdminSellCarView)
)

// Update Request Status
router.post(
    "/admin/update-status",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(sellCarController.updateRequestStatus)
)

// Delete Request
router.post(
    "/admin/delete",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(sellCarController.deleteRequest)
)

module.exports = router