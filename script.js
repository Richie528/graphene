let graphColours = ["#df8e1d", "#9c42f5", "#40a02b", "#e64553", "#1f4694"];
let yummyNumbers = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 50, 75, 100, 150, 200, 250, 300, 500, 1000];

// input elements
let hGraphTitleInput = document.getElementById("graph-title");
let hIvInput = document.getElementById("iv");
let hDvInput = document.getElementById("dv");
let hIvUnitsInput = document.getElementById("iv-units");
let hDvUnitsInput = document.getElementById("dv-units");
let hNumberOfVariables = document.getElementById("no-variables");
let hNumberOfTrials = document.getElementById("no-trials");
let hInputTable = document.querySelector(".table");
let hTableInputs = hInputTable.getElementsByTagName("input");
let hAverages = hInputTable.querySelectorAll(".avg");
// style settings
let hSGraphTitle = document.getElementById("show-graph-title");
let hSAverage = document.getElementById("show-average");
let hSNonAverage = document.getElementById("show-non-average");
let hSTrendline = document.getElementById("show-trendline");
let hSEquation = document.getElementById("show-equation");
let hSRSquared = document.getElementById("show-r-squared");
// graph elements
let hGraph = document.querySelector(".graph");
let hCanvas = document.getElementById("canvas");
let hContext = hCanvas.getContext("2d");
let hGraphTitle = document.querySelector(".graph-title");
let hEquation = document.querySelector(".equation");
let hRSquared = document.querySelector(".r-squared");
let hXAxisLabel = document.querySelector(".x-axis-label");
let hYAxisLabel = document.querySelector(".y-axis-label");

// graph info
let graphTitle = "";
let independentVariable = "";
let dependentVariable = "";
let ivUnits = "";
let dvUnits = "";
// table
let numberOfVariables = 0;
let numberOfTrials = 0;
// graph stats
let yScale = 0;
let xScale = 0;
let yIncrement = 0;
let xIncrement = 0;
let yRange = [0, 0];
let xRange = [0, 0];
let gradient = 0;
let intercept = 0;
let rSquared = 0;
// style settings
let sGraphTitle = true;
let sAverage = true;
let sNonAverage = true;
let sTrendline = true;
let sEquation = true;
let sRSquared = true;

let data = []

function readInput() {
    graphTitle = hGraphTitleInput.value;
    independentVariable = hIvInput.value;
    dependentVariable = hDvInput.value;
    ivUnits = hIvUnitsInput.value;
    dvUnits = hDvUnitsInput.value;
    numberOfVariables = parseInt(hNumberOfVariables.value);
    if (Number.isNaN(numberOfVariables)) numberOfVariables = 0;
    numberOfTrials = parseInt(hNumberOfTrials.value);
    if (Number.isNaN(numberOfTrials)) numberOfTrials = 0;
}

function readSettings() {
    sGraphTitle = hSGraphTitle.checked;
    sAverage = hSAverage.checked;
    sNonAverage = hSNonAverage.checked;
    sTrendline = hSTrendline.checked;
    sEquation = hSEquation.checked;
    sRSquared = hSRSquared.checked;
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
            if (j == 0) tableData.children[0].value = (data[i][0] == 0) ? "" : data[i][0];
            else tableData.children[0].value = (data[i][1][j - 1] == 0) ? "" : data[i][1][j - 1];
        }
        avgTableData = document.createElement("td");
        avgTableData.classList.add("avg");
        row.appendChild(avgTableData);
        hInputTable.appendChild(row);
    }
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
    readInput();
    getTableInputs();
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

function calculateScale() {
    // calculate scale
    let mnX = 999999999999999, mxX = 0, mnY = 999999999999999, mxY = 0;
    for (let i = 0; i < numberOfVariables; i++) {
        mnX = Math.min(mnX, data[i][0]);
        mxX = Math.max(mxX, data[i][0]);
        mnY = Math.min(mnY, ...data[i][1]);
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
    xRange = [mnX, mxX];
    yRange = [mnY, mxY];
}

function calculateTrendline() {
    let sumX = 0;
    let sumY = 0;
    let a = 0, b, c = 0, d, e, f;
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
    gradient = (a - b) / (c - d);
    e = sumY;
    f = gradient * sumX;
    intercept = (e - f) / numberOfVariables;
}

function calculateRSquared() {
    let sumResiduals = 0;
    let sumDiff = 0;
    for (let i = 0; i < numberOfVariables; i++) {
        y = data[i][0] * gradient + intercept;
        let residual = data[i][2] - y;
        sumResiduals += residual * residual;
    }
    let avgY = 0;
    for (let i = 0; i < numberOfVariables; i++) {
        avgY += data[i][2];
    }
    avgY = avgY / numberOfVariables;
    for (let i = 0; i < numberOfVariables; i++) {
        sumDiff += (data[i][2] - avgY) * (data[i][2] - avgY);
    }
    rSquared = 1 - sumResiduals / sumDiff;
}

function clearCanvas() {
    hContext.canvas.width = hContext.canvas.width;
}

function drawTitle() {
    if (sGraphTitle) hGraphTitle.textContent = graphTitle;
    else hGraphTitle.textContent = "";
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
        if (yRange[1] == 0) break;
        let y = 600 - i * yIncrement * yScale;
        hContext.moveTo(95, y); hContext.lineTo(100, y); hContext.stroke();
        let scaleLabel = document.createElement("div");
        scaleLabel.classList.add("y-axis-scale-label");
        scaleLabel.textContent = (yIncrement * i).toString();
        scaleLabel.style.top = (y + 3).toString() + "px";
        hGraph.appendChild(scaleLabel);
        if (i * yIncrement >= yRange[1]) break;
    }
    for (let i = 0;; i++) {
        if (xRange[1] == 0) break;
        let x = 100 + i * xIncrement * xScale;
        hContext.moveTo(x, 600); hContext.lineTo(x, 605); hContext.stroke();
        let scaleLabel = document.createElement("div");
        scaleLabel.classList.add("x-axis-scale-label");
        scaleLabel.textContent = (xIncrement * i).toString();
        scaleLabel.style.left = (x).toString() + "px";
        hGraph.appendChild(scaleLabel);
        if (i * xIncrement >= xRange[1]) break;
    }
}

function drawPoints() {
    for (let i = 0; i < numberOfVariables; i++) {
        let x = 100 + data[i][0] * xScale;
        if (sNonAverage) {
            for (let j = 0; j < numberOfTrials; j++) {
                let y = 600 - data[i][1][j] * yScale;
                hContext.fillStyle = graphColours[j];
                hContext.beginPath();
                hContext.arc(x, y, 3, 0, 2 * Math.PI);
                hContext.fill();
            }
        }
        if (sAverage) {
            let y = 600 - data[i][2] * yScale;
            hContext.fillStyle = "#4287f5";
            hContext.beginPath();
            hContext.arc(x, y, 3, 0, 2 * Math.PI);
            hContext.fill();
        }
    }
}

function drawTrendline() {
    if (sTrendline) {
        hContext.strokeStyle = "#4287f5";
        hContext.moveTo(100 + xRange[0] * xScale, 600 - (gradient * xRange[0] + intercept) * yScale);
        hContext.lineTo(100 + xRange[1] * xScale, 600 - (gradient * xRange[1] + intercept) * yScale);
        hContext.stroke();
    }
}

function drawEquation() {
    if (sEquation) hEquation.textContent = "y = " + gradient.toString() + "x + " + intercept.toString();
    else hEquation.textContent = "";
}

function drawRSquared() {
    if (sRSquared) hRSquared.textContent = "R² = " + rSquared.toString();
    else hRSquared.textContent = "";
}

function drawGraph() {
    readInput();
    readSettings();
    readTable();
    calculateScale();
    calculateTrendline();
    calculateRSquared();
    clearCanvas();
    drawTitle();
    drawAxes();
    drawPoints();
    drawTrendline();
    drawEquation();
    drawRSquared();
}

hGraphTitleInput.onkeyup = 
hIvInput.onkeyup = hDvInput.onkeyup = 
hIvUnitsInput.onkeyup = hDvUnitsInput.onkeyup =
hNumberOfVariables.onkeyup = hNumberOfTrials.onkeyup = 
hSGraphTitle.onclick = 
hSAverage.onclick = 
hSNonAverage.onclick =
hSTrendline.onclick = 
hSEquation.onclick = 
hSRSquared.onclick = 
function() { 
    createTable(); 
    drawGraph();
};

readInput();
createTable();