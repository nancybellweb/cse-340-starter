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
        const classifications = await invModel.getClassifications()

        res.render("inventory/management", {
        title: "Inventory Management",
        nav,
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
 *  JSON Inventory Route (AJAX)
 * ************************** */
invCont.getInventoryJSON = async function (req, res) {
    const classification_id = req.params.classification_id
    const data = await invModel.getInventoryByClassificationId(classification_id)
    return res.json(data)
}

module.exports = invCont