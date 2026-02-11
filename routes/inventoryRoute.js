
/// routes/inventoryRoute.js
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")
console.log("invValidate =", invValidate) 
// Test route to confirm router loads
router.get("/test", (req, res) => {
    res.send("inventoryRoute loaded")
})

// Management view 
router.get(
    "/management",
    utilities.handleErrors(invController.buildInventoryManagement)
)

// Add Classification
router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
)
router.post(
    "/add-classification",
    utilities.handleErrors(invController.addClassification)
)

// Add Inventory
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.buildAddInventory)
)
router.post(
    "/add-inventory",
    utilities.handleErrors(invController.addInventory)
)

// View inventory by classification
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
)

// View inventory detail page
router.get(
    "/detail/:invId",
    utilities.handleErrors(invController.buildByInvId)
)

// AJAX JSON route
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)
//select product route
router.get(
    "/select",
    utilities.handleErrors(async (req, res) => {
        const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList()

        res.render("inventory/select-products", {
        title: "Select Products",
        nav,
        classificationList
        })
    })
)
// Route to build the edit inventory view
router.get(
    "/edit/:inv_id",
    utilities.handleErrors(invController.buildEditInventory)
);
//Post to handle inventory request
router.post(
    "/update/", 
    invValidate.updateInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

module.exports = router