const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)






/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
        })
        grid += '</ul>'
    } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the vehicle detail HTML
* ************************************ */
Util.buildVehicleDetail = async function(data) {
    // 1. Format the Price and Mileage first
    const price = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
    }).format(data.inv_price);

    const mileage = new Intl.NumberFormat('en-US').format(data.inv_miles);

    // 2. Build the HTML string using those formatted variables
    let display = '<section class="vehicle-details">'
    display += `<img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">`
    display += '<div class="details-content">'
    display += `<h2>${data.inv_make} ${data.inv_model} Details</h2>`
    
    // Use the 'price' and 'mileage' variables we just created
    display += `<p class="price"><strong>Price:</strong> ${price}</p>`
    display += `<p class="description"><strong>Description:</strong> ${data.inv_description}</p>`
    display += `<p class="color"><strong>Color:</strong> ${data.inv_color}</p>`
    display += `<p class="miles"><strong>Mileage:</strong> ${mileage} miles</p>`
    
    display += '</div>'
    display += '</section>'
    return display
}
/* ***************************
 * Check Login Middleware
 *************************** */
Util.checkLogin = function (req, res, next) {
    if (req.session && req.session.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in to access this page.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 * Build classification dropdown
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let list = `<select name="classification_id" id="classificationList" required>`
    list += `<option value="">Choose a Classification</option>`

    data.rows.forEach((row) => {
        list += `<option value="${row.classification_id}"`

        if (classification_id == row.classification_id) {
        list += " selected"
        }

        list += `>${row.classification_name}</option>`
    })

    list += `</select>`
    return list
}                  

module.exports = Util
/* **************************************/