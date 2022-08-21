var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const table = document.querySelector('.container');
const tableBody = document.querySelector('.tbody');

const promptBtn = document.querySelector('.promptBtn');

const north = document.querySelector(".north");
const south = document.querySelector(".south");
const west = document.querySelector(".west");
const east = document.querySelector(".east");
const gather = document.querySelector(".gather");
const drop = document.querySelector(".drop");

var defaultRoboPos = {
    r: 1,
    c: 1,
    hasCrate: false,
    crateNumber: null,
};
var defaultCratePos = [
    {
        r: 5,
        c: 5,
    },
    {
        r: 1,
        c: 5,
    },
];

const initiatePrompt = () => {
    const userInput = window.prompt('Please enter the command');
    if (userInput === null) {
        return;
    }
    const actionsArray = userInput.split(' ');
    console.log(actionsArray);
    performActions(actionsArray);
};

promptBtn.addEventListener('click', initiatePrompt);

const performActions = (commands) => {
    let rowCount = 0;
    let colCount = 0;
    commands.forEach((command) => {
        if (command === 'N') {
            moveNorth();
            rowCount--;
        } else if (command === 'S') {
            moveSouth();
            rowCount++;
        } else if (command === 'W') {
            moveWest();
            colCount--;
        } else if (command === 'E') {
            moveEast();
            colCount++;
        } else if (command === 'G') {
            defaultCratePos.forEach((crate, index) => {
                if (
                    crate.r === defaultRoboPos.r &&
                    crate.c === defaultRoboPos.c &&
                    !defaultRoboPos.hasCrate
                ) {
                    defaultRoboPos.crateNumber = index;
                    liftCrate();
                }
            });
        } else if (command === 'D') {
            if (defaultRoboPos.hasCrate && defaultRoboPos.r === defaultCratePos[defaultRoboPos.crateNumber].r) {
                const multipleCratesAtSamePos = defaultCratePos.filter(crate => crate.r === defaultRoboPos.r && crate.c === defaultRoboPos.c)
                if (multipleCratesAtSamePos.length >= 2) {
                    return;
                }
                defaultCratePos[defaultRoboPos.crateNumber].r = defaultRoboPos.r;
                defaultCratePos[defaultRoboPos.crateNumber].c = defaultRoboPos.c;
                defaultRoboPos.crateNumber = null;
                dropCrate();
            }
        }
    });
    moveItem(rowCount, colCount);
    if (defaultRoboPos.hasCrate) {
        defaultCratePos[defaultRoboPos.crateNumber].r = defaultRoboPos.r;
        defaultCratePos[defaultRoboPos.crateNumber].c = defaultRoboPos.c;
    }
    reRenderDom();
};


const placeCrates = (row, col) => {
    let character = '';
    defaultCratePos.forEach((crate) => {
        if (crate.r === row && crate.c === col) {
            character = '#';
        }
    });
    return character;
};

const moveItem = (row, col) => {
    if (
        row >= 1 &&
        row <= 10 &&
        col >= 1 &&
        col <= 10 &&
        defaultRoboPos.r >= 1 &&
        defaultRoboPos.r <= 10 &&
        defaultRoboPos.c >= 1 &&
        defaultRoboPos.c <= 10 &&
        row === defaultRoboPos.r &&
        col === defaultRoboPos.c
    ) {
        return '*';
    }
};

const moveNorth = () => {
    defaultRoboPos = {
        ...defaultRoboPos,
        r:
            defaultRoboPos.r > 1 && defaultRoboPos.r <= 10 ? defaultRoboPos.r - 1 : 1,
    };
};
const moveSouth = () => {
    defaultRoboPos = {
        ...defaultRoboPos,
        r:
            defaultRoboPos.r >= 1 && defaultRoboPos.r < 10 ? defaultRoboPos.r + 1 : 1,
    };
};

const moveWest = () => {
    defaultRoboPos = {
        ...defaultRoboPos,
        c:
            defaultRoboPos.c > 1 && defaultRoboPos.c <= 10 ? defaultRoboPos.c - 1 : 1,
    };
};

const moveEast = () => {
    defaultRoboPos = {
        ...defaultRoboPos,
        c:
            defaultRoboPos.c >= 1 && defaultRoboPos.c < 10 ? defaultRoboPos.c + 1 : 1,
    };
};

const liftCrate = () => {
    defaultRoboPos = { ...defaultRoboPos, hasCrate: true };
};

const dropCrate = () => {
    defaultRoboPos = { ...defaultRoboPos, hasCrate: false };
};

const reRenderDom = () => {
    tableBody.innerHTML = '';
    numbers.forEach((rowNumber, rowIndex) => {
        var tableRow = document.createElement('TR');
        const tableDataMap = numbers.map((colNumber, colIndex) => {
            var tableData = document.createElement('TD');
            tableData.style.width = '30px';
            tableData.style.height = '30px';
            tableData.style.textAlign = 'center';
            const moveItemResult = moveItem(rowNumber, colNumber);
            const placeCrateResult = placeCrates(rowNumber, colNumber);
            const tableDataContent = document.createTextNode(
                (moveItemResult ? moveItemResult : '') +
                (placeCrateResult ? placeCrateResult : '')
            );
            tableData.appendChild(tableDataContent);
            return tableData;
        });
        tableDataMap.forEach((tableData) => {
            tableRow.appendChild(tableData);
        });
        tableBody.appendChild(tableRow);
    });
};

reRenderDom();

north.addEventListener('click', () => performActions(['N']));
south.addEventListener('click', () => performActions(['S']));
west.addEventListener('click', () => performActions(['W']));
east.addEventListener('click', () => performActions(['E']));
gather.addEventListener('click', () => performActions(['G']));
drop.addEventListener('click', () => performActions(['D']));

