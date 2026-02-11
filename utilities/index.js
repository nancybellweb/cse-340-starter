const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ***************************
 * Constructs the nav HTML unordered list
 * ************************** */
Util.getNav = async function () {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'

    data.forEach((row) => {
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

/* ***************************
 * Build classification dropdown list
 * Used in Add Inventory form
 * ************************** */
Util.buildClassificationList = async function (selectedId = null) {
    let data = await invModel.getClassifications()
    let list = '<select name="classification_id" id="classification_id" required>'
    list += '<option value="">Choose a Classification</option>'

    data.forEach((row) => {
        list += `<option value="${row.classification_id}"`

        if (selectedId == row.classification_id) {
        list += " selected"
        }

        list += `>${row.classification_name}</option>`
    })

    list += "</select>"
    return list
}
/* ****************************************
 * Build the classification grid HTML
 * Used by invCont.buildByClassificationId
 **************************************** */
Util.buildClassificationGrid = async function (data) {
    if (!data || data.length === 0) {
        return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }

    let grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
        grid += '<li>'
        grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`
        grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`
        grid += '</a>'
        grid += '<div class="inv-info">'
        grid += `<h2><a href="/inv/detail/${vehicle.inv_id}">${vehicle.inv_make} ${vehicle.inv_model}</a></h2>`
        grid += `<span class="price">$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`
        grid += '</div>'
        grid += '</li>'
    })
    grid += '</ul>'

    return grid
}

/* ****************************************
 * Build the vehicle detail HTML
 * Used by invCont.buildByInvId
 **************************************** */
// utilities/index.js (or wherever Util.buildClassificationList is defined)
// utilities/index.js (or wherever Util.buildClassificationList is defined)
Util.buildClassificationList = async function (selectedId = null) {
    const data = await invModel.getClassifications()
    let list = '' 

    data.forEach((row) => {
        list += `<option value="${row.classification_id}"`
        if (selectedId == row.classification_id) {
        list += ' selected'
        }
        list += `>${row.classification_name}</option>`
    })

    return list
}
/* ***************************
 * Middleware for handling async errors
 * ************************** */
Util.handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next)

/* ***************************
 * Middleware to check for JWT token and set req.accountData if valid
 * ************************** */
Util.checkJWTToken = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.clearCookie("jwt")
            return next()
        }
        req.accountData = decoded
        next()
        })
    } else {
        next()
    }
    }
const jwt = require("jsonwebtoken")

Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        (err, accountData) => {
            if (err) {
            res.clearCookie("jwt")
            res.locals.loggedin = false
            return next()
            }
            res.locals.loggedin = true
            res.locals.accountData = accountData
            return next()
        }
        )
    } else {
        res.locals.loggedin = false
        next()
    }
}

module.exports = Util

