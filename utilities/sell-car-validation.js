//Server validation for the sell car page

const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/*  **********************************
 *  Sell Car Data Validation Rules - check for required fields and valid formats on the form submission
 * ********************************* */
validate.sellCarRules = () => {
    return [
        body("classification_id")
        .trim()
        .notEmpty()
        .isInt()
        .withMessage("Please select a classification."), //classification_id is required and must be an integer

        // make, model, year, description, price, miles, color, and contact phone are all required fields with specific validation rules
        body("car_make")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the make."),

        body("car_model")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the model."),

        body("car_year")
        .trim()
        .notEmpty()
        .isInt({ min: 1900, max: 2100 })
        .withMessage("Please provide a valid year (1900-2100)."),

        body("car_description")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a description."),

        body("asking_price")
        .trim()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Please provide a valid price."),

        body("car_miles")
        .trim()
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage("Please provide valid mileage."),

        body("car_color")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the color."),

        body("contact_phone")
        .trim()
        .notEmpty()
        .matches(/^[\d\s\-\(\)]+$/)
        .withMessage("Please provide a valid phone number.")
    ]
}

/* ******************************
 * Check data and return errors or continue to submission - if there are validation errors, re-render the form with error messages and previously entered data to allow the user to correct their input without losing their progress (sticky form)
 * ***************************** */
validate.checkSellCarData = async (req, res, next) => {
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

    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        const classificationList = await utilities.buildClassificationList(classification_id)

        return res.render("sell-car/sell-car-form", {
        errors,
        title: "Sell Your Car",
        classificationList,
        classification_id,
        car_make,
        car_model,
        car_year,
        car_description,
        asking_price,
        car_miles,
        car_color,
        contact_phone
        })
    }
    next()
}

module.exports = validate