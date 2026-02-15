//Controller layer for the sell car page

const sellCarModel = require("../models/sell-car-model")
const utilities = require("../utilities/")

const sellCarCont = {}

/* ***************************
 *  Build Sell Car Form View (for logged-in users) - used on the user sell car management page - shows the form where users can submit their car details to sell
 * ************************** */
sellCarCont.buildSellCarForm = async function (req, res, next) {
    try {
        const classificationList = await utilities.buildClassificationList()
        
        res.render("sell-car/sell-car-form", {
        title: "Sell Your Car",
        classificationList,
        errors: null
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Process Sell Car Request - processes the form submission from the sell car form, validates the input, and saves the request to the database - used on the user sell car management page
 * ************************** */
sellCarCont.submitSellCarRequest = async function (req, res, next) {
    const {
        classification_id,
        car_make,
        car_model,
        car_year,
        car_description,
        asking_price,
        car_miles,
        car_color,
        contact_phone
    } = req.body

    const account_id = res.locals.accountData.account_id

    try {
        const result = await sellCarModel.addSellCarRequest(
        account_id,
        classification_id,
        car_make,
        car_model,
        car_year,
        car_description,
        asking_price,
        car_miles,
        car_color,
        contact_phone
        )

        if (result) {
        req.flash("notice", "Thank you! Your car details have been submitted. Our team will reach out to you soon.")
        return res.redirect("/")
        } else {
        req.flash("notice", "Failed to submit your request. Please try again.")
        const classificationList = await utilities.buildClassificationList(classification_id)

        return res.status(500).render("sell-car/sell-car-form", {
            title: "Sell Your Car",
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
 *  Build Admin View (all sell car requests)- shows all the sell car requests in the system - used on the admin sell car management page
 * ************************** */
sellCarCont.buildAdminSellCarView = async function (req, res, next) {
    try {
        const requests = await sellCarModel.getAllSellCarRequests()
        
        res.render("sell-car/admin-view", {
        title: "Sell Car Requests - Admin",
        requests,
        message: req.flash("notice")
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Update Request Status (Admin only) - allows admin to update the status of a sell car request (e.g., pending, approved, rejected) - used on the admin sell car management page
 * ************************** */
sellCarCont.updateRequestStatus = async function (req, res, next) {
    const { request_id, status } = req.body

    try {
        const result = await sellCarModel.updateSellCarRequestStatus(request_id, status)

        if (result) {
        req.flash("notice", `Request status updated to "${status}".`)
        } else {
        req.flash("notice", "Failed to update status.")
        }
        
        return res.redirect("/sell-car/admin")
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Delete Request (Admin only) - allows admin to delete a sell car request from the system - used on the admin sell car management page
 * ************************** */
sellCarCont.deleteRequest = async function (req, res, next) {
    const request_id = parseInt(req.body.request_id)

    try {
        const result = await sellCarModel.deleteSellCarRequest(request_id)

        if (result) {
        req.flash("notice", "Request deleted successfully.")
        } else {
        req.flash("notice", "Failed to delete request.")
        }
        
        return res.redirect("/sell-car/admin")
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Build My Cars View (User's own requests) - shows the logged-in user's own sell car requests and their statuses - used on the user sell car management page
 * ************************** */
sellCarCont.buildMyCars = async function (req, res, next) {
    try {
        const account_id = res.locals.accountData.account_id
        const requests = await sellCarModel.getSellCarRequestsByAccountId(account_id)
        
        res.render("sell-car/my-cars", {
        title: "My Cars",
        requests,
        message: req.flash("notice")
        })
    } catch (error) {
        next(error)
    }
}

module.exports = sellCarCont