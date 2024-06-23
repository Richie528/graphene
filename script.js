// input elements
let hIvInput = document.getElementById("iv");
let hDvInput = document.getElementById("dv");
let hIvUnitsInput = document.getElementById("iv-units");
let hDvUnitsInput = document.getElementById("dv-units");
let hNumberOfVariables = document.getElementById("no-variables");
let hNumberOfTrials = document.getElementById("no-trials");
let hInputTable = document.querySelector(".table");
// graph elements
let hCanvas = document.getElementById("canvas");
let hContext = hCanvas.getContext("2d");
let hXAxisLabel = document.querySelector(".x-axis-label");
let hYAxisLabel = document.querySelector(".y-axis-label");

// variables
let independentVariable = "";
let dependentVariable = "";
let ivUnits = "";
let dvUnits = "";
let numberOfVariables = 0;
let numberOfTrials = 0;

let data = []

function readInput() {
    independentVariable = hIvInput.value;
    dependentVariable = hDvInput.value;
    ivUnits = hIvUnitsInput.value;
    dvUnits = hDvUnitsInput.value;
    numberOfVariables = parseInt(hNumberOfVariables.value);
    numberOfTrials = parseInt(hNumberOfTrials.value);
}

function createTable() {
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
            tableData.style.backgroundColor = "var(--c-crust)";
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

function drawAxes() {
    hContext.lineWidth = 1;
    // y axis
    hContext.moveTo(100, 100);
    hContext.lineTo(100, 600);
    hContext.stroke();
    // x axis
    hContext.lineTo(880, 600);
    hContext.stroke();
    // axis labels
    hXAxisLabel.textContent = independentVariable + " (" + ivUnits + ")";
    hYAxisLabel.textContent = dependentVariable + " (" + dvUnits + ")";
}

function readAndDraw() {
    readInput();
    drawAxes();
}

hIvInput.onkeyup = function() {readAndDraw()};
hDvInput.onkeyup = function() {readAndDraw()};
hIvUnitsInput.onkeyup = function() {readAndDraw()};
hDvUnitsInput.onkeyup = function() {readAndDraw()};

hNumberOfVariables.onkeyup = function() {
    readAndDraw();
    createTable();
}
hNumberOfTrials.onkeyup = function() {
    readAndDraw();
    createTable();
}

readAndDraw();