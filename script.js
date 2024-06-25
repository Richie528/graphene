let graphColours = ["#df8e1d", "#04a5e5", "#40a02b", "#e64553", "#1e66f5"];
let yummyNumbers = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 50, 75, 100, 150, 200, 250, 300, 500, 1000];

// input elements
let hIvInput = document.getElementById("iv");
let hDvInput = document.getElementById("dv");
let hIvUnitsInput = document.getElementById("iv-units");
let hDvUnitsInput = document.getElementById("dv-units");
let hNumberOfVariables = document.getElementById("no-variables");
let hNumberOfTrials = document.getElementById("no-trials");
let hInputTable = document.querySelector(".table");
let hTableInputs = hInputTable.getElementsByTagName("input");
let hAverages = hInputTable.querySelectorAll(".avg");
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
let yScale = 0;
let xScale = 0;
let yIncrement = 0;
let xIncrement = 0;

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
    readInput();
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
    for (let i = 2; i <= numberOfTrials + 1; i++) {
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
    let avgTableHeading = document.createElement("th");
    avgTableHeading.textContent = "Average";
    secondRow.appendChild(avgTableHeading);
    hInputTable.appendChild(secondRow);
    // create rest of rows
    for (let i = 0; i < numberOfVariables; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j <= numberOfTrials; j++) {
            let tableData = document.createElement("td");
            tableData.style.backgroundColor = "var(--c-crust)";
            tableData.innerHTML = `<input type = "text" onkeypress="return (event.charCode !=8 && event.charCode ==0 || ( event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)))">`;
            row.appendChild(tableData);
            if (i >= data.length) continue;
            if (j > data[0][1].length) continue;
            if (j == 0) tableData.children[0].value = data[i][0];
            else tableData.children[0].value = data[i][1][j - 1];
        }
        avgTableData = document.createElement("td");
        avgTableData.classList.add("avg");
        row.appendChild(avgTableData);
        hInputTable.appendChild(row);
    }
    getTableInputs();
    readTable();
}

function getTableInputs() {
    hTableInputs = hInputTable.getElementsByTagName("input");
    let temp = [];
    for (let i = 0; i < numberOfVariables; i++) {
        let row = [];
        for (let j = 0; j < numberOfTrials + 1; j++) {
            row.push(hTableInputs[i * (numberOfTrials + 1) + j]);
        }
        temp.push(row);
    }
    hTableInputs = [...temp];
    for (let i = 0; i < numberOfVariables; i++) {
        for (let j = 0; j < numberOfTrials + 1; j++) {
            hTableInputs[i][j].onkeydown = function(e) {
                if (e.keyCode == "38" && i > 0) {
                    setTimeout(function() {
                        hTableInputs[i - 1][j].focus();
                        hTableInputs[i - 1][j].selectionStart = hTableInputs[i - 1][j].value.length;
                        hTableInputs[i - 1][j].selectionEnd = hTableInputs[i - 1][j].value.length;
                    }, 50);
                }
                if (e.keyCode == "40" && i < numberOfVariables - 1) {
                    hTableInputs[i + 1][j].focus();
                    hTableInputs[i + 1][j].selectionStart = hTableInputs[i + 1][j].value.length;
                    hTableInputs[i + 1][j].selectionEnd = hTableInputs[i + 1][j].value.length;
                }
                if (e.keyCode == "37" && j > 0) {
                    if (hTableInputs[i][j].selectionStart == 0) {
                        setTimeout(function() {
                            hTableInputs[i][j - 1].focus();
                            hTableInputs[i][j - 1].selectionStart = hTableInputs[i][j - 1].value.length;
                            hTableInputs[i][j - 1].selectionEnd = hTableInputs[i][j - 1].value.length;
                        }, 50);
                    }
                }
                if (e.keyCode == "39" && j < numberOfTrials) {
                    if (hTableInputs[i][j].selectionEnd == hTableInputs[i][j].value.length) {
                        hTableInputs[i][j + 1].focus();
                        hTableInputs[i][j + 1].selectionStart = hTableInputs[i][j + 1].value.length;
                        hTableInputs[i][j + 1].selectionEnd = hTableInputs[i][j + 1].value.length;
                    }
                }
            }
            hTableInputs[i][j].onkeyup = function() {
                drawGraph();
            }
        }
    }
}

function readTable() {
    hAverages = hInputTable.querySelectorAll(".avg");
    data = [];
    for (let i = 0; i < numberOfVariables; i++) {
        row = [0, [], 0];
        if (!Number.isNaN(parseFloat(hTableInputs[i][0].value))) row[0] = parseFloat(hTableInputs[i][0].value);
        let cnt = 0;
        for (let j = 1; j <= numberOfTrials; j++) {
            if (Number.isNaN(parseFloat(hTableInputs[i][j].value))) row[1].push(0);
            else row[1].push(parseFloat(hTableInputs[i][j].value));
            cnt += row[1][j - 1];
        }
        row[2] = Math.round(cnt / numberOfTrials * 100) / 100;
        hAverages[i].textContent = row[2].toFixed(2);
        data.push(row);
    }
}

function drawGraph() {
    readInput();
    readTable();
    clearCanvas();
    calculateScale();
    drawAxes();
    drawPoints();
}

function clearCanvas() {
    hContext.canvas.width = hContext.canvas.width;
}

function calculateScale() {
    // calculate scale
    mxX = 0, mxY = 0;
    for (let i = 0; i < numberOfVariables; i++) {
        mxX = Math.max(mxX, data[i][0]);
        mxY = Math.max(mxY, ...data[i][1]);
    }
    for (let yummyNumber of yummyNumbers) {
        if (mxY / yummyNumber > 15) continue;
        yScale = 480 / Math.ceil(mxY / yummyNumber) / yummyNumber;
        yIncrement = yummyNumber;
        break;
    }
    for (let yummyNumber of yummyNumbers) {
        if (mxX / yummyNumber > 15) continue;
        xScale = 750 / Math.ceil(mxX / yummyNumber) / yummyNumber;
        xIncrement = yummyNumber;
        break;
    }
}

function drawAxes() {
    // draw axis lines
    hContext.lineWidth = 0.5;
    hContext.moveTo(100, 100); hContext.lineTo(100, 600); hContext.stroke();
    hContext.lineTo(880, 600); hContext.stroke();
    // create axis labels
    hXAxisLabel.textContent = independentVariable + " (" + ivUnits + ")";
    hYAxisLabel.textContent = dependentVariable + " (" + dvUnits + ")";
    // scale labels
    xScaleLabels = document.querySelectorAll(".x-axis-scale-label");
    yScaleLabels = document.querySelectorAll(".y-axis-scale-label");
    for (let element of xScaleLabels) element.remove();
    for (let element of yScaleLabels) element.remove();
    for (let i = 0;; i++) {
        let y = 600 - i * yIncrement * yScale;
        hContext.moveTo(95, y); hContext.lineTo(100, y); hContext.stroke();
        let scaleLabel = document.createElement("div");
        scaleLabel.classList.add("y-axis-scale-label");
        scaleLabel.textContent = (yIncrement * i).toString();
        scaleLabel.style.top = (y + 3).toString() + "px";
        hGraph.appendChild(scaleLabel);
        if (i * yIncrement >= mxY) break;
    }
    for (let i = 0;; i++) {
        let x = 100 + i * xIncrement * xScale;
        hContext.moveTo(x, 600); hContext.lineTo(x, 605); hContext.stroke();
        let scaleLabel = document.createElement("div");
        scaleLabel.classList.add("x-axis-scale-label");
        scaleLabel.textContent = (xIncrement * i).toString();
        scaleLabel.style.left = (x).toString() + "px";
        hGraph.appendChild(scaleLabel);
        if (i * xIncrement >= mxX) break;
    }
}

function drawPoints() {
    for (let i = 0; i < numberOfVariables; i++) {
        let x = 100 + data[i][0] * xScale;
        for (let j = 0; j < numberOfTrials; j++) {
            let y = 600 - data[i][1][j] * yScale;
            hContext.fillStyle = graphColours[j];
            hContext.fillRect(x - 2, y - 2, 4, 4);
        }
        let y = 600 - data[i][2] * yScale;
        hContext.fillStyle = "#333333";
        hContext.fillRect(x - 2, y - 2, 4, 4);
    }
}

function drawTrendLine() {
    // linear
    let sumX = 0;
    let sumY = 0;
    let a = 0, b, c = 0, d;
    for (let i = 0; i < numberOfVariables; i++) {
        sumX += data[i][0];
        sumY += data[i][2];
        a += data[i][0] * data[i][2];
        c += data[i][0] * data[i][0];
    }
    a = a * numberOfVariables;
    b = sumX * sumY;
    c = c * numberOfVariables;
    d = sumX * sumX;
    let m = (a - b) / (c - d);
    console.log(m);
}

hIvInput.onkeyup = function() {createTable(); drawGraph();};
hDvInput.onkeyup = function() {createTable(); drawGraph();};
hIvUnitsInput.onkeyup = function() {createTable(); drawGraph();};
hDvUnitsInput.onkeyup = function() {createTable(); drawGraph();};
hNumberOfVariables.onkeyup = function() {createTable(); drawGraph();};
hNumberOfTrials.onkeyup = function() {createTable(); drawGraph();};

readInput();
createTable();