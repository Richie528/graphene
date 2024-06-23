// input elements
hIvInput = document.getElementById("iv");
hDvInput = document.getElementById("dv");
hIvUnitsInput = document.getElementById("iv-units");
hDvUnitsInput = document.getElementById("dv-units");
hNumberOfVariables = document.getElementById("no-variables");
hNumberOfTrials = document.getElementById("no-trials");
hInputTable = document.querySelector(".table");

// variables
independentVariable = "";
dependentVariable = "";
ivUnits = "";
dvUnits = "";
numberOfVariables = 0;
numberOfTrials = 0;

data = []

function readInput() {
    independentVariable = hIvInput.value;
    dependentVariable = hDvInput.value;
    ivUnits = hIvUnitsInput.value;
    dvUnits = hDvUnitsInput.value;
    numberOfVariables = parseInt(hNumberOfVariables.value);
    numberOfTrials = parseInt(hNumberOfTrials.value);
}

function updateTable() {
    // clear the table
    hInputTable.innerHTML = "";
    // create first row (iv, dv, blank for no. trials - 1)
    let firstRow = document.createElement("tr");
    let tableHeadingIv = document.createElement("th");
    tableHeadingIv.textContent = independentVariable;
    let tableHeadingDv = document.createElement("th");
    tableHeadingDv.textContent = dependentVariable;
    firstRow.appendChild(tableHeadingIv);
    firstRow.appendChild(tableHeadingDv);
    for (let i = 2; i <= numberOfTrials; i++) {
        let tableData = document.createElement("td");
        firstRow.appendChild(tableData);
    }
    hInputTable.appendChild(firstRow);
    // create second row (blank, trial no 1, trial no...)
    let secondRow = document.createElement("tr");
    let blank = document.createElement("td");
    secondRow.appendChild(blank);
    for (let i = 1; i <= numberOfTrials; i++) {
        let tableHeading = document.createElement("th");
        tableHeading.textContent = "Trial " + i.toString();
        secondRow.appendChild(tableHeading);
    }
    hInputTable.appendChild(secondRow);
    // create rest of rows
    for (let i = 1; i <= numberOfVariables; i++) {
        let row = document.createElement("tr");
        for (let i = 0; i <= numberOfTrials; i++) {
            let tableData = document.createElement("td");
            tableData.innerHTML = `<input type = "text" onkeypress="return (event.charCode !=8 && event.charCode ==0 || ( event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)))">`
            row.appendChild(tableData);
        }
        hInputTable.appendChild(row);
    }
}

function readTable() {
    data = [];
    for (let i = 2; i < 2 + numberOfVariables; i++) {
        hRow = hInputTable.children[i].getElementsByTagName("input");
        row = [parseInt(hRow[0].value), []];
        for (let j = 1; j <= numberOfTrials; j++) {
            row[1].push(parseInt(hRow[j].value));
        }
        data.push(row);
    }
}
