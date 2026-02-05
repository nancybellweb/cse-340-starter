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

module.exports = Util

