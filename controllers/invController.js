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

    module.exports = invCont

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
invCont.buildInventoryManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash("notice"),
        })
    } catch (error) {
        next(error)
    }
}

module.exports = invCont