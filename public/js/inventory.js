'use strict' 
    
    // Get a list of items in inventory based on the classification_id 
    let classificationList = document.querySelector("#classificationList")
    classificationList.addEventListener("change", function () { 
    let classification_id = classificationList.value 
    console.log(`classification_id is: ${classification_id}`) 
    let classIdURL = "/inv/getInventory/"+classification_id 
    fetch(classIdURL) 
    .then(function (response) { 
    if (response.ok) { 
        return response.json(); 
    } 
    throw Error("Network response was not OK"); 
    }) 
    .then(function (data) { 
    console.log(data); 
    buildInventoryList(data); 
    }) 
    .catch(function (error) { 
    console.log('There was a problem: ', error.message) 
    }) 
    })

    // Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");

    let dataTable = `
        <table class="inventory-table">
        <thead>
            <tr>
            <th>Vehicle Name</th>
            <th>Modify</th>
            <th>Delete</th>
            </tr>
        </thead>
        <tbody>
    `;

    data.forEach(function (element) {
        dataTable += `
        <tr>
            <td>${element.inv_make} ${element.inv_model}</td>
            <td><a class="table-action modify" href="/inv/edit/${element.inv_id}">Modify</a></td>
            <td><a class="table-action delete" href="/inv/delete/${element.inv_id}">Delete</a></td>
        </tr>
        `;
    });

    dataTable += `
        </tbody>
        </table>
    `;

    inventoryDisplay.innerHTML = dataTable;
}