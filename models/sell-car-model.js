//Model layer for the sell car page

const pool = require("../database/")

/* ***************************
 *  Add new sell car request : Saves new car submission to database - when the user submits the form on the sell car page
 * ************************** */
async function addSellCarRequest(
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
    ) {
    try {
        const sql = `
        INSERT INTO sell_car_requests (
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
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *;
        `
        const data = await pool.query(sql, [
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
        ])
        return data.rows[0]
    } catch (error) {
        console.error("addSellCarRequest error:", error)
        return null
    }
}

/* ***************************
 *  Get all sell car requests (for admin) - shows all requests to admin, with user info and classification name - used on the admin sell car management page
 * ************************** */
async function getAllSellCarRequests() {
    try {
        const sql = `
        SELECT 
            s.*,
            c.classification_name,
            a.account_firstname,
            a.account_lastname,
            a.account_email
        FROM sell_car_requests s
        JOIN classification c ON s.classification_id = c.classification_id
        JOIN account a ON s.account_id = a.account_id
        ORDER BY s.request_date DESC
        `
        const data = await pool.query(sql)
        return data.rows
    } catch (error) {
        console.error("getAllSellCarRequests error:", error)
        return []
    }
}

/* ***************************
 *  Get sell car requests by account_id - shows only the requests for the logged in user - used on the user sell car management page -  Gets user's own requests, with classification name
 * ************************** */
async function getSellCarRequestsByAccountId(account_id) {
    try {
        const sql = `
        SELECT 
            s.*,
            c.classification_name
        FROM sell_car_requests s
        JOIN classification c ON s.classification_id = c.classification_id
        WHERE s.account_id = $1
        ORDER BY s.request_date DESC
        `
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch (error) {
        console.error("getSellCarRequestsByAccountId error:", error)
        return []
    }
}

/* ***************************
 *  Update sell car request status - allows admin to update the status of a request (pending, approved, rejected) - used on the admin sell car management page
 * ************************** */
async function updateSellCarRequestStatus(request_id, status) {
    try {
        const sql = `
        UPDATE sell_car_requests 
        SET status = $1
        WHERE request_id = $2
        RETURNING *
        `
        const data = await pool.query(sql, [status, request_id])
        return data.rows[0]
    } catch (error) {
        console.error("updateSellCarRequestStatus error:", error)
        return null
    }
}
/* ***************************
 *  Delete sell car request - allows admin to delete a request - used on the admin sell car management page
 * ************************** */
async function deleteSellCarRequest(request_id) {
    try {
        const sql = "DELETE FROM sell_car_requests WHERE request_id = $1 RETURNING *"
        const data = await pool.query(sql, [request_id])
        return data.rows[0]
    } catch (error) {
        console.error("deleteSellCarRequest error:", error)
        return null
    }
}

module.exports = {
    addSellCarRequest,
    getAllSellCarRequests,
    getSellCarRequestsByAccountId,
    updateSellCarRequestStatus,
    deleteSellCarRequest
}