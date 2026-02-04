// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for the specific vehicle detail page
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to deliver the inventory management view
router.get("/management", utilities.checkLogin, utilities.handleErrors(invController.buildInventoryManagement));
// Route to deliver the add classification view
router.get("/add-classification", utilities.checkLogin, utilities.handleErrors(invController.buildAddClassification));

module.exports = router;