//This file will hold the server side validation rules and error checking middleware.

const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invValidate = {}

/* ****************************************
 * Classification Validation Rules
 **************************************** */
invValidate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .notEmpty()
        .withMessage("Please provide a classification name.")
        .matches(/^[A-Za-z]+$/)
        .withMessage("Classification name must contain only letters, no spaces or special characters.")
    ]
}

/* ****************************************
 * Check data and return errors or continue
 **************************************** */
invValidate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors,
        classification_name
        })
    }
    next()
}

module.exports = invValidate