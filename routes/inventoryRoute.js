// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for the specific vehicle detail page
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to deliver the inventory management view
router.get("/management", utilities.checkLogin, utilities.handleErrors(invController.buildInventoryManagement));
// Route to deliver the add classification view
router.get("/add-classification", utilities.checkLogin, utilities.handleErrors(invController.buildAddClassification));
// Route to deliver the add vehicle view
router.post(
    "/add-classification",
    utilities.checkLogin,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)
//route to deliver the add inventory view
router.get(
    "/add-inventory",
    utilities.checkLogin,
    utilities.handleErrors(invController.addInventory)
)
router.post(
    "/add-inventory",
    utilities.checkLogin,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.processAddInventory)
)

module.exports = router;