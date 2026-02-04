const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    //IF a different data is requested but not found, send to 404 page
    if (!data || data.length === 0) {
    const err = new Error("No vehicles found for this category.")
    err.status = 404
    return next(err) 
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}


/* ***************************
 * Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryById(inv_id)
    
    // This will build the HTML for the specific vehicle detail
    const vehicleHtml = await utilities.buildVehicleDetail(data)
    
    res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav: res.locals.nav, 
    vehicleHtml,
    messages: req.flash(), // flash messages
    })
}

/* ***************************
 *  Deliver Inventory Management View
 * ************************** */
//sends the inventory list to the view-
invCont.buildInventoryManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let inventory = await invModel.getAllInventory()
        
        res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        inventory,
        message: req.flash("notice"),
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
* Deliver Add Classification View
* *************************************** */

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    })
}/* ****************************************
* Process Add Classification
**************************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body

    try {
        // Insert into database
        const result = await invModel.addClassification(classification_name)

        if (result) {
        // Success: rebuild nav so the new classification appears immediately
        let nav = await utilities.getNav()
        req.flash("notice", `Classification "${classification_name}" added successfully.`)
        return res.status(201).render("inventory/management", {
            title: "Inventory Management",
            nav,
            message: req.flash("notice")
        })
        } else {
        // Failure: re-render form
        let nav = await utilities.getNav()
        req.flash("notice", "Failed to add classification.")
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
/* ****************************************
* Deliver Add Inventory View
**************************************** */
invCont.addInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList()

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
/* ****************************************
* Process Add Inventory
**************************************** */
invCont.processAddInventory = async function (req, res, next) {
    //pulls all field from form
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
    //sends to model to add to database
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
        //if successful, shows success message
        if (result) {
        let nav = await utilities.getNav()
        req.flash("notice", "Inventory item added successfully.")
        return res.status(201).render("inventory/management", {
            title: "Inventory Management",
            nav,
            message: req.flash("notice")
        })
        //if failed, shows failure message
        } else {
        let nav = await utilities.getNav()
        req.flash("notice", "Failed to add inventory item.")
        let classificationList = await utilities.buildClassificationList(classification_id)
        //re-renders add-inventory view with previous data
        return res.status(500).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null,
            ...req.body
        })
        }
    } catch (error) {
        next(error)
    }
}
/* ****************************************
* Deliver Edit Inventory View
**************************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inv_id = req.params.invId

    const itemData = await invModel.getInventoryById(inv_id)
    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    let nav = await utilities.getNav()

    res.render("inventory/edit-inventory", {
        title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
        nav,
        classificationList,
        errors: null,
        ...itemData
    })
}
/* ****************************************
* update the inventory after edit
**************************************** */
invCont.updateInventory = async function (req, res, next) {
    const {
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
    } = req.body

    const updateResult = await invModel.updateInventory(
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
    )

    if (updateResult) {
        req.flash("notice", `${inv_make} ${inv_model} was successfully updated.`)
        res.redirect("/inv/management")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.redirect(`/inv/edit/${inv_id}`)
    }
}

/* ****************************************
* Deliver Delete Confirmation View
**************************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const itemData = await invModel.getInventoryById(inv_id)
    let nav = await utilities.getNav()

    res.render("inventory/delete-confirm", {
        title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price
    })
}
/* ****************************************
* Delete Inventory Item *POST
**************************************** */
invCont.deleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id)

    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
        req.flash("notice", "The vehicle was successfully deleted.")
        res.redirect("/inv/management")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.redirect(`/inv/delete/${inv_id}`)
    }
}


module.exports = invCont