const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Test route
router.get("/test", (req, res) => {
    res.send("inventoryRoute loaded")
})

/* ============================
    ADMIN‑ONLY ROUTES
============================ */

// Management view
router.get(
    "/management",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(invController.buildInventoryManagement)
)

// Add Classification
router.get(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(invController.buildAddClassification)
)

router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkEmployee,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Add Inventory
router.get(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(invController.buildAddInventory)
)

router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkEmployee,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Edit Inventory
router.get(
    "/edit/:inv_id",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(invController.buildEditInventory)
)

router.post(
    "/update",
    utilities.checkLogin,
    utilities.checkEmployee,
    invValidate.updateInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Delete Inventory
router.get(
    "/delete/:inv_id",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(invController.buildDeleteInventory)
)

router.post(
    "/delete",
    utilities.checkLogin,
    utilities.checkEmployee,
    utilities.handleErrors(invController.deleteInventory)
)

/* ============================
    PUBLIC ROUTES
============================ */

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

// Select product route
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

module.exports = router