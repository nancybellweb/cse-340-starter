const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
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
    
    // Create the HTML for the specific vehicle (we'll make this utility next)
    const vehicleHtml = await utilities.buildVehicleDetail(data)
    
    res.render("./inventory/detail", {
        title: `${data.inv_make} ${data.inv_model}`,
        nav: res.locals.nav, 
        vehicleHtml,
    })
}