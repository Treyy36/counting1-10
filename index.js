var selectScene = document.getElementById("selectScene");
var gameScene = document.getElementById("gameScene");
// gameScene.style.display = "none";
selectScene.style.display = "none";

const gameContainer = document.getElementById("gameScene-container")
const gameContainerWidth = parseInt(window.getComputedStyle(gameContainer).width, 10);
const gameContainerHeight = parseInt(window.getComputedStyle(gameContainer).height, 10);

const imageSize = 75;
const imageUrlsHidden = [
    "img/Count10_Puzzle_Pieces_Blue_1.jpg",
    "img/Count10_Puzzle_Pieces_Blue_2.jpg",
    "img/Count10_Puzzle_Pieces_Blue_3.jpg",
    "img/Count10_Puzzle_Pieces_Blue_4.jpg",
    "img/Count10_Puzzle_Pieces_Blue_5.jpg",
    "img/Count10_Puzzle_Pieces_Blue_6.jpg",
    "img/Count10_Puzzle_Pieces_Blue_7.jpg",
    "img/Count10_Puzzle_Pieces_Blue_8.jpg",
    "img/Count10_Puzzle_Pieces_Blue_9.jpg",
    "img/Count10_Puzzle_Pieces_Blue_10.jpg"
];
const imageUrlsColored = [
    "img/Count10_Puzzle_Pieces_1.jpg",
    "img/Count10_Puzzle_Pieces_2.jpg",
    "img/Count10_Puzzle_Pieces_3.jpg",
    "img/Count10_Puzzle_Pieces_4.jpg",
    "img/Count10_Puzzle_Pieces_5.jpg",
    "img/Count10_Puzzle_Pieces_6.jpg",
    "img/Count10_Puzzle_Pieces_7.jpg",
    "img/Count10_Puzzle_Pieces_8.jpg",
    "img/Count10_Puzzle_Pieces_9.jpg",
    "img/Count10_Puzzle_Pieces_10.jpg"
]
// function startGame1() {
//     selectScene.style.display = "none";
//     gameScene.style.display = "block"
// }
const randomPositions = generateRandomPositions(imageUrlsHidden.length, imageSize, imageSize, gameContainerWidth, gameContainerHeight);
const correctPositions = generateCorrectPositions(2, 5, imageSize);

function generateCorrectPositions(numRows, numCols, elementLength) {
    const positions = [];
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = 150 + (elementLength * col); // Start x at 150 and increment by elementLength
            const y = 150 + (elementLength * row); // Start y at 150 and increment by elementLength for each row
            positions.push({ x, y });
        }
    }
    return positions;
}
function generateRandomPositions(numElements, elementWidth, elementHeight, areaWidth, areaHeight) {
    const positions = [];

    while (positions.length < numElements) {
        // Generate a random position
        const x = Math.floor(Math.random() * (areaWidth - elementWidth));
        const y = Math.floor(Math.random() * (areaHeight - elementHeight));
        
        // Check if it overlaps with any existing position
        let overlap = false;
        for (const pos of positions) {
            if (areRectanglesOverlapping(x, y, pos.x, pos.y, elementWidth, elementHeight)) {
                overlap = true;
                break;
            }
        }
        
        // If no overlap, add the position to the array
        if (!overlap) {
            positions.push({ x, y });
        }
    }

    return positions;
}

// Function to check if two rectangles overlap
function areRectanglesOverlapping(x1, y1, x2, y2, width, height) {
    return (
        x1 < x2 + width &&
        x1 + width > x2 &&
        y1 < y2 + height &&
        y1 + height > y2
    );
}

let cnt = 1;
function placeImages(imageUrls, positions) {
    console.log("placing images")
    imageUrls.forEach((url, index) => {
        // Create an image element
        const img = document.createElement("img");
        img.src = url;
        
        // Set size and position
        img.style.width = `${imageSize}px`;
        img.style.height = `${imageSize}px`;
        img.style.position = "absolute";
        img.style.left = `${positions[index].x}px`;
        img.style.top = `${positions[index].y}px`;

        img.setAttribute("data-value", "yourCustomValue");
        img.customValue = cnt;
        // Add an onclick function
        img.onclick = function() {
            checkOrder(img);
        };

        // Add the image to the document
        gameContainer.appendChild(img);

        cnt++;
    });
}


function placeImages(imageUrls, positions) {
    console.log("placing images")
    imageUrls.forEach((url, index) => {
        // Create an image element
        const img = document.createElement("img");
        img.src = url;
        
        // Set size and position
        img.style.width = `${imageSize}px`;
        img.style.height = `${imageSize}px`;
        img.style.position = "absolute";
        img.style.left = `${positions[index].x}px`;
        img.style.top = `${positions[index].y}px`;


        // Add an onclick function
        img.onclick = function() {
            checkOrder(img);
        };

        // Add the image to the document
        gameContainer.appendChild(img);


    });
}

let i = 0;
const order = [1,2,3,4,5,6,7,8,9,10];
function checkOrder(img) {
    console.log("Checking Order");
    let a = img.customValue
    if (a == order[i]) {
        console.log("Correct");
        placeCorrectImage(img.src, correctPositions)
        i++;
        if (a == 10) {
            console.log("YOU WIN");
            i = 0;
        }

    } else {
        console.log("incorrect");
        i = 0;
    }
}

function revealImg() {
    console.log("Revealing Img");
}
// Place images at the generated positions
// placeImages(imageUrlsHidden, randomPositions)
placeImages(imageUrlsColored, correctPositions);