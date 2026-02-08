// Wait for the DOM to load

document.addEventListener("DOMContentLoaded", () => {
    const classificationList = document.getElementById("classificationList")
    console.log("classificationList element:", classificationList)

    const inventoryDisplay = document.getElementById("inventoryDisplay")

    classificationList.addEventListener("change", async () => {
        const classificationId = classificationList.value
        console.log("Selected ID:", classificationId)
        // Clear display if nothing selected
        if (!classificationId) {
        inventoryDisplay.innerHTML = ""
        return
        }

        try {
        // Fetch JSON data from server
        const response = await fetch(`/inv/getInventory/${classificationId}`)
        const data = await response.json()

        // If no vehicles found
        if (!data.length) {
            inventoryDisplay.innerHTML = "<p>No inventory found for this classification.</p>"
            return
        }

        // Build table
        let table = `
            <table>
            <thead>
                <tr>
                <th>Make</th>
                <th>Model</th>
                </tr>
            </thead>
            <tbody>
        `

        data.forEach(item => {
            table += `
            <tr>
                <td>${item.inv_make}</td>
                <td>${item.inv_model}</td>
            </tr>
            `
        })

        table += `
            </tbody>
            </table>
        `

        inventoryDisplay.innerHTML = table

        } catch (error) {
        console.error("AJAX error:", error)
        inventoryDisplay.innerHTML = "<p>Error loading inventory.</p>"
        }
    })
})