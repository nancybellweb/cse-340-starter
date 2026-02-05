document.getElementById("classificationSelect").addEventListener("change", function() {
    const classificationId = this.value

    if (!classificationId) return

    fetch(`/inv/getInventory/${classificationId}`)
        .then(response => response.json())
        .then(data => buildInventoryTable(data))
        .catch(err => console.error(err))
})

function buildInventoryTable(data) {
    let html = `
        <table>
        <thead>
            <tr>
            <th>Vehicle</th>
            <th>Price</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
    `

    data.forEach(item => {
        html += `
        <tr>
            <td>${item.inv_make} ${item.inv_model}</td>
            <td>$${item.inv_price}</td>
            <td>
            <a href="/inv/edit/${item.inv_id}">Edit</a>
            <a href="/inv/delete/${item.inv_id}">Delete</a>
            </td>
        </tr>
        `
    })

    html += `</tbody></table>`

    document.getElementById("inventoryDisplay").innerHTML = html
}