const { parse } = require("dotenv")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Inventory Management View
 *  (Assignment 4 + AJAX dropdown)
 * ************************** */
invCont.buildInventoryManagement = async function (req, res, next) {
    try {
        const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList()
        const classifications = await invModel.getClassifications()
        
        res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        classificationList,
        classifications,
        message: req.flash("notice")
        })
    } catch (error) {
        next(error)
    }
    }

    /* ***************************
    *  Add Classification View
    * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    })
    }

    /* ***************************
    *  Process Add Classification
    * ************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body

    try {
        const result = await invModel.addClassification(classification_name)

        if (result) {
        req.flash("notice", `Classification "${classification_name}" added successfully.`)
        return res.redirect("/inv/management")
        } else {
        req.flash("notice", "Failed to add classification.")
        const nav = await utilities.getNav()
        return res.status(500).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null
        })
        }
    } catch (error) {
        next(error)
    }
}
/* ***********************************************
 * Build the Classification View

 *************************************************/
// temporary debug - paste this near the top of buildByClassificationId

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()
    console.log("buildByClassificationId: classification_id =", classification_id)
    console.log("buildByClassificationId: data sample =", JSON.stringify(data && data[0], null, 2))

    // If no vehicles found, send to error handler
    if (!data.length) {
        return next({ status: 404, message: "No vehicles found." })
    }

    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0].classification_name

    res.render("inventory/classification", {
        title: className + " vehicles",
        nav,
        grid
    })
}


/* ***********************************************
 * Build the Vehicle Detail View
 *************************************************/
invCont.buildByInvId = async function (req, res, next) {
    try {
        const inv_id = req.params.invId
        const data = await invModel.getInventoryByInvId(inv_id)
        const nav = await utilities.getNav()

        if (!data) {
        return next({ status: 404, message: "Vehicle not found." })
        }

        const detail = await utilities.buildVehicleDetail(data)

        res.render("inventory/detail", {
        title: `${data.inv_make ?? data.make ?? ""} ${data.inv_model ?? data.model ?? ""}`,
        nav,
        detail,
        vehicleHtml: detail,            // keep your template working
        message: req.flash("notice")
        })
    } catch (err) {
        next(err)
    }
}

/* ***************************
 *  Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    try {
        const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList()

        res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    } = req.body

    try {
        const result = await invModel.addInventory(
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
        )

        if (result) {
        req.flash("notice", "Inventory item added successfully.")
        return res.redirect("/inv/management")
        } else {
        req.flash("notice", "Failed to add inventory item.")
        const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(classification_id)

        return res.status(500).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null,
            ...req.body // sticky values
        })
        }
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}
/* ***************************
 *  edit inventory view - update button controller / Management view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const inventoryData = await invModel.getInventoryByInvId(inv_id)
    const classificationList = await utilities.buildClassificationList(inventoryData.classification_id)
    const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`
    res.render("inventory/edit-inventory", {
        title: `Edit ${itemName}`,
        nav,
        classificationSelect: classificationList,
        errors: null,
        inv_id: inventoryData.inv_id,
        inv_make: inventoryData.inv_make,
        inv_model: inventoryData.inv_model,
        inv_year: inventoryData.inv_year,    
        inv_description: inventoryData.inv_description,
        inv_image: inventoryData.inv_image,
        inv_thumbnail: inventoryData.inv_thumbnail,
        inv_price: inventoryData.inv_price,
        inv_miles: inventoryData.inv_miles,
        inv_color: inventoryData.inv_color,
        classification_id: inventoryData.classification_id
    })
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()

    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        // if the model returns just a success flag, use body values:
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", `The ${itemName} was successfully updated.`)
        return res.redirect("/inv/management")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`

        req.flash("notice", "Sorry, the update failed.")
        return res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
        })
    }
}
/* ***************************
 *  Show confirmation page for inventory deletion
 * ************************** */

invCont.buildDeleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()

    const itemData = await invModel.getInventoryById(inv_id)

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description
    })
}
/* ***************************
 *  Process Inventory Deletion
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id)

    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
        req.flash("notice", "The vehicle was successfully deleted.")
        return res.redirect("/inv/management")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        return res.redirect(`/inv/delete/${inv_id}`)
    }
}
module.exports = invCont