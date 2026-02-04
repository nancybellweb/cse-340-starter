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

/* ****************************************
 * Inventory Validation Rules
 **************************************** */
invValidate.inventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .notEmpty()
        .withMessage("Please provide a vehicle make."),

        body("inv_model")
        .trim()
        .notEmpty()
        .withMessage("Please provide a vehicle model."),

        body("inv_year")
        .isInt({ min: 1900, max: 2100 })
        .withMessage("Please provide a valid year."),

        body("inv_description")
        .trim()
        .notEmpty()
        .withMessage("Please provide a description."),

        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Please provide an image path."),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Please provide a thumbnail path."),

        body("inv_price")
        .isFloat({ min: 0 })
        .withMessage("Please provide a valid price."),
    body("inv_miles")
        .isInt({ min: 0 })
        .withMessage("Please provide valid mileage."),

        body("inv_color")
        .trim()
        .notEmpty()
        .withMessage("Please provide a color.")
    ]
}

/* ****************************************
 * Check inventory data
 **************************************** */
invValidate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)
    const classificationList = await utilities.buildClassificationList()

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors,
        ...req.body
        })
    }
    next()
}
/* ******************************
 * Check update data and return errors
 ****************************** */
invValidate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()

        // Rebuild classification dropdown with selected value
        const classificationList = await utilities.buildClassificationList(
        req.body.classification_id
        )

        // Re-render the edit form with sticky values and errors
        return res.render("inventory/edit-inventory", {
        title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
        nav,
        classificationList,
        errors: errors.array(),
        ...req.body
        })
    }
    next()
}



module.exports = invValidate