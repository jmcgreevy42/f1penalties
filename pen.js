function main() {
    qualiSize();

    const formElem = document.querySelector('form');
    fillGrid(formElem);

    formElem.addEventListener('submit', (e) => {
        // on form submission, prevent default
        e.preventDefault();
        fillGrid(formElem);
    });
}

function fillGrid(formElem) {


    // construct a FormData object, which fires the formdata event
    const formData = new FormData(formElem);

    let numDrivers = formData.get("numDrivers")
    // console.log(numDrivers);
    let drivers = []
    for (let idx = 1; idx <= numDrivers; idx++) {
        let driver = { "name": formData.get("driver" + idx), "qualPos": idx, "penalty": formData.get("pen" + idx), "posDrop": parseInt(formData.get("posNum" + idx)) }

        drivers.push(driver)
    }
    // console.log(drivers);

    let driversNoPen = []
    let driversGridPen = []
    let driversBackGrid = []
    let driversPitLane = []
    drivers.forEach(function (driver) {

        switch (driver["penalty"]) {
            case "none":
                driver["tmpPos"] = driver["qualPos"]
                driversNoPen.push(driver)
                break;
            case "pos":
                driver["tmpPos"] = driver["qualPos"] + driver["posDrop"]
                driversGridPen.push(driver)
                break;
            case "backGrid":
                driver["tmpPos"] = driver["qualPos"]
                driversBackGrid.push(driver)
                break;
            case "pitLane":
                driver["tmpPos"] = driver["qualPos"]
                driversPitLane.push(driver)
                break;
            default:
                driver["tmpPos"] = null
                break;
        }
    });

    // Sort the drivers with position penalties
    driversGridPen.sort(function (a, b) {
        return a.tmpPos - b.tmpPos;
    })
    // console.log(driversGridPen)

    let grid = []
    let gridPos = 1;
    let idx = 0
    while (idx < driversNoPen.length) {
        let penDrivers = []
        let addPenDrivers = false
        for (penIdx = 0; penIdx < driversGridPen.length; penIdx++) {
            let penDriver = driversGridPen[penIdx]
            if (penDriver["tmpPos"] <= gridPos && !("gridPos" in penDriver)) {
                penDrivers.push(penDriver)
            }
        }

        for (penIdx = 0; penIdx < penDrivers.length; penIdx++) {
            let penDriver = penDrivers[penIdx]
            penDriver["gridPos"] = gridPos
            grid.push(penDriver)

            gridPos++;
            addPenDrivers = true;
        }
        if (addPenDrivers) {
            continue
        }

        let driver = driversNoPen[idx]
        driver["gridPos"] = gridPos
        grid.push(driver)

        gridPos++;
        idx++
    }

    // Get the remaining grid position penalty drivers
    let driversGridPenRem = []
    driversGridPen.forEach(function (driver) {
        if (!("gridPos" in driver)) {
            driversGridPenRem.push(driver)
        }
    })
    // Sort the drivers with position penalties
    driversGridPenRem.sort(function (a, b) {
        return a.tmpPos - b.tmpPos;
    })
    driversGridPenRem.forEach(function (driver) {
        driver["gridPos"] = gridPos
        grid.push(driver)

        gridPos++;
    })

    // Add back of the grid drivers
    for (idx = 0; idx < driversBackGrid.length; idx++) {
        let driver = driversBackGrid[idx]
        driver["gridPos"] = gridPos
        grid.push(driver)

        gridPos++;
    }

    // Add pit lane drivers
    for (idx = 0; idx < driversPitLane.length; idx++) {
        let driver = driversPitLane[idx]
        driver["gridPos"] = "PL"
        grid.push(driver)

        gridPos++;
    }

    // console.log(grid);

    let outputTBody = document.getElementById("outputTBody")
    outputTBody.replaceChildren()


    for (let idx = 0; idx < grid.length; idx++) {
        let row = document.createElement("tr")
        let tdDriver = document.createElement("td")

        let position = document.createElement("span")
        position.innerText = grid[idx]["gridPos"] + ":"
        position.style.display = "inline-block"
        position.style.width = "5ch"
        position.style.textAlign = "right"

        let driver = document.createElement("span")
        driver.innerText = grid[idx]["name"]
        tdDriver.append(position)
        tdDriver.append(driver)

        row.append(tdDriver)

        outputTBody.append(row)
    }
}

function qualiSize() {
    let numDrivers = document.getElementById("numDrivers").value
    let inputTBody = document.getElementById("inputTBody")

    let existingRows = inputTBody.children
    let inputRows = []
    for (let idx = 0; idx < existingRows.length && idx < numDrivers; idx++) {
        inputRows.push(existingRows[idx])
    }

    for (let idx = inputRows.length + 1; idx <= numDrivers; idx++) {
        let row = document.createElement("tr")
        let tdDriver = document.createElement("td")

        let labelName = document.createElement("label")
        labelName.setAttribute("for", "driver" + idx)
        labelName.innerText = idx + ":"
        labelName.style.display = "inline-block"
        labelName.style.width = "5ch"

        let inputName = document.createElement("input")
        inputName.setAttribute("type", "text")
        inputName.setAttribute("name", "driver" + idx)
        inputName.setAttribute("id", "driver" + idx)
        tdDriver.append(labelName)
        tdDriver.append(inputName)

        row.append(tdDriver)

        let tdPen = document.createElement("td")

        let inputNone = document.createElement("input")
        inputNone.setAttribute("type", "radio")
        inputNone.setAttribute("name", "pen" + idx)
        inputNone.setAttribute("value", "none")
        inputNone.setAttribute("id", "none" + idx)
        inputNone.setAttribute("checked", true)
        tdPen.append(inputNone)

        let labelNone = document.createElement("label")
        labelNone.setAttribute("for", "none" + idx)
        labelNone.innerText = "None"
        tdPen.append(labelNone)

        let inputPositions = document.createElement("input")
        inputPositions.setAttribute("type", "radio")
        inputPositions.setAttribute("name", "pen" + idx)
        inputPositions.setAttribute("value", "pos")
        inputPositions.setAttribute("id", "pos" + idx)
        tdPen.append(inputPositions)

        let labelPositions = document.createElement("label")
        labelPositions.setAttribute("for", "pos" + idx)
        labelPositions.innerText = "Positions:"
        tdPen.append(labelPositions)

        let inputPositionsNum = document.createElement("input")
        inputPositionsNum.setAttribute("type", "number")
        inputPositionsNum.setAttribute("for", "pos" + idx)
        inputPositionsNum.setAttribute("name", "posNum" + idx)
        inputPositionsNum.setAttribute("min", "0")
        inputPositionsNum.style.width = "6ch"
        tdPen.append(inputPositionsNum)

        let inputBackGrid = document.createElement("input")
        inputBackGrid.setAttribute("type", "radio")
        inputBackGrid.setAttribute("name", "pen" + idx)
        inputBackGrid.setAttribute("value", "backGrid")
        inputBackGrid.setAttribute("id", "backGrid" + idx)
        tdPen.append(inputBackGrid)

        let labelBackGrid = document.createElement("label")
        labelBackGrid.setAttribute("for", "backGrid" + idx)
        labelBackGrid.innerText = "Back of Grid"
        tdPen.append(labelBackGrid)

        let inputPitLane = document.createElement("input")
        inputPitLane.setAttribute("type", "radio")
        inputPitLane.setAttribute("name", "pen" + idx)
        inputPitLane.setAttribute("value", "pitLane")
        inputPitLane.setAttribute("id", "pitLane" + idx)
        tdPen.append(inputPitLane)

        let labelPitLane = document.createElement("label")
        labelPitLane.setAttribute("for", "pitLane" + idx)
        labelPitLane.innerText = "Pit Lane"
        tdPen.append(labelPitLane)

        row.append(tdPen)

        inputRows.push(row)
    }

    inputTBody.replaceChildren(...inputRows)
}
