let graphColours = ["#000000", "#000000", "#000000", "#000000", "#000000"];
let yummyNumbers = [0.001, 0.05, 0.01, 0.5, 0.1, 1, 2, 3, 4, 5, 10, 20, 25, 50, 75, 100, 150, 200, 250, 300, 500, 1000];

// input elements
let hIvInput = document.getElementById("iv");
let hDvInput = document.getElementById("dv");
let hIvUnitsInput = document.getElementById("iv-units");
let hDvUnitsInput = document.getElementById("dv-units");
let hNumberOfVariables = document.getElementById("no-variables");
let hNumberOfTrials = document.getElementById("no-trials");
let hInputTable = document.querySelector(".table");
// graph elements
let hGraph = document.querySelector(".graph");
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
let yIncrement = 0;
let xDistanceBetween = 0;
let yDistanceBetween = 0;

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
        row = [0, []];
        if (!Number.isNaN(parseInt(hRow[0].value))) row[0] = parseInt(hRow[0].value);
        for (let j = 1; j <= numberOfTrials; j++) {
            if (Number.isNaN(parseInt(hRow[j].value))) row[1].push(0);
            else row[1].push(parseInt(hRow[j].value));
        }
        data.push(row);
    }
}

function drawAxes() {
    readTable();
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
    // MAKE SCALE
    // delete preexisting scale labels
    xScaleLabels = document.querySelectorAll(".x-axis-scale-label");
    yScaleLabels = document.querySelectorAll(".y-axis-scale-label");
    for (let element of xScaleLabels) element.remove();
    for (let element of yScaleLabels) element.remove();
    // get max value
    mxY = 0;
    for (let i = 0; i < numberOfVariables; i++) {
        mxY = Math.max(mxY, ...data[i][1]);
    }
    // calculate increment
    yIncrement = mxY / 10;
    let l = 0, r = yummyNumbers.length;
    while (l != r - 1) {
        let m = Math.floor((l + r) / 2);
        if (yummyNumbers[m] <= yIncrement) l = m;
        else r = m;
    }
    // get y num and distance between
    let numY = Math.ceil(mxY / yIncrement);
    yIncrement = yummyNumbers[l];
    yDistanceBetween = 480 / numY;
    // draw y-axis scale
    for (let i = 0; i <= numY; i++) {
        let y = 600 - yDistanceBetween * i;
        hContext.moveTo(95, y);
        hContext.lineTo(100, y);
        hContext.stroke();
        let scaleLabel = document.createElement("div");
        scaleLabel.classList.add("y-axis-scale-label");
        scaleLabel.textContent = (yIncrement * i).toString();
        scaleLabel.style.top = (y + 3).toString() + "px";
        hGraph.appendChild(scaleLabel);
    }
    // get x distance between
    xDistanceBetween = Math.ceil(750 / numberOfVariables);
    // draw x-axis scale
    for (let i = 0; i <= numberOfVariables; i++) {
        let x = 100 + xDistanceBetween * i;
        hContext.moveTo(x, 600);
        hContext.lineTo(x, 605);
        hContext.stroke();
        let scaleLabel = document.createElement("div");
        scaleLabel.classList.add("x-axis-scale-label");
        if (i == 0) scaleLabel.textContent = "0";
        else scaleLabel.textContent = data[i - 1][0].toString();
        scaleLabel.style.left = (x).toString() + "px";
        hGraph.appendChild(scaleLabel);
    }
}

function drawPoints() {
    for (let i = 0; i < numberOfVariables; i++) {
        for (let j = 0; j < numberOfTrials; j++) {

        }
    }
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
    createTable();
    readAndDraw();
}
hNumberOfTrials.onkeyup = function() {
    createTable();
    readAndDraw();
}

readInput();
createTable();
readAndDraw();