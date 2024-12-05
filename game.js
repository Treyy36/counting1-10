const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 960;
canvas.height = 640;

const correctSound = new Audio('./audio/answer-is-correct.mp3');
const incorrectSound = new Audio('./audio/answer-is-wrong.mp3');
const rows = 2; // Number of rows in the puzzle grid
const cols = 5;  // Number of columns in the puzzle grid
const numTiles = rows * cols;
const animationSpeed = 0.05;

const fullImageSrc = "img/Count_10_Game_Full_Puzzle_Image_1_resized.jpg"; // Full puzzle image
const fullImageWidth = 800;
const fullImageHeight = 300;
let fullImage = new Image();
fullImage.src = fullImageSrc;

const smallTileWidth = fullImageWidth / cols / 2;    //80
const smallTileHeight = fullImageHeight / rows / 2;  //75
const tileWidth = fullImageWidth / cols;    //160
const tileHeight = fullImageHeight / rows;  //150

let orderCnt = 0;
const order =[]
for (let i = 0; i < numTiles; i++) {
    order[i] = i+1;
}
console.log(order)

class ImageTile {
    constructor({ position, velocity, value }) {
        this.position = position;
        this.velocity = velocity;
        this.value = value;
        this.width = smallTileWidth;
        this.height = smallTileHeight;
        this.isRevealed = false;
        this.resetTile = false;
        this.fontColor = 'white';

        this.onClick();
    }

    draw() {
        const sx = (this.value-1) % cols * tileWidth //Source X in full image
        const sy = Math.floor((this.value - 1) / cols) * tileHeight;

        // console.log(`Tile ${this.value} | sx: ${sx}, sy: ${sy} | posX: ${this.position.x}, posY: ${this.position.y}`);

        c.drawImage(
            fullImage, // Source image
            sx, sy, // Source x, y
            tileWidth, tileHeight, // Source width, height
            this.position.x, this.position.y, // Destination x, y
            this.width, this.height // Destination width, height
        );
        const fontSize = Math.min(this.width, this.height) * 0.6; // 40% of the smaller tile dimension
        c.fillStyle = this.fontColor; // Text color
        c.font = `bold ${fontSize}px Tahoma`; // Set dynamic font size
        c.textAlign = 'center'; // Center text horizontally
        c.textBaseline = 'middle'; // Center text vertically
        c.fillText(
            this.value, // The value to display
            this.position.x + this.width / 2, // X: center of the tile
            this.position.y + this.height / 2 // Y: center of the tile
        );

        if (!this.isRevealed) {
            c.fillStyle = 'rgba(0, 170, 190, 0.8)'; // Blue with 50% transparency
            c.fillRect(
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
            c.fillStyle = this.fontColor; // Text color
            c.font = `bold ${fontSize}px Tahoma`; // Set dynamic font size
            c.textAlign = 'center'; // Center text horizontally
            c.textBaseline = 'middle'; // Center text vertically
            c.fillText(
                this.value, // The value to display
                this.position.x + this.width / 2, // X: center of the tile
                this.position.y + this.height / 2 // Y: center of the tile
            );
        }
    }

    moveToTarget(targetX, targetY, speed) {
        this.position.x += (targetX - this.position.x) * speed;
        this.position.y += (targetY - this.position.y) * speed;
    }

    resizeToTarget(targetWidth, targetHeight, speed) {
        this.width += (targetWidth - this.width) * speed;
        this.height += (targetHeight - this.height) * speed;
    }

    update() {
        this.draw()
        if (!this.isRevealed) {
            this.draw();
        } else {
            this.draw()
            const targetPosition = correctPositions[this.value - 1];
            this.moveToTarget(targetPosition.x, targetPosition.y, animationSpeed);
            this.resizeToTarget(tileWidth, tileHeight, animationSpeed);
        }

        if (this.resetTile) {
            this.draw()
            const targetPosition = randomPositions[this.value - 1];
            this.moveToTarget(targetPosition.x, targetPosition.y, animationSpeed);
        }
    }

    containsPoint(x, y) {
        return (
            x >= this.position.x &&
            x <= this.position.x + this.width &&
            y >= this.position.y &&
            y <= this.position.y + this.height
        );
    }

    onClick() {
        this.clickHandler = (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            if (this.containsPoint(mouseX, mouseY)) {
                this.checkOrder(this.value);
            }
        };

        canvas.addEventListener('click', this.clickHandler);
    }

    revealTile() {
        this.isRevealed = true;
        canvas.removeEventListener('click', this.clickHandler);
    }

    checkOrder(value) {
        if (value === order[orderCnt]) {
            console.log(`Image with value ${this.value} clicked! - Correct!`)
            correctSound.currentTime = 0;
            incorrectSound.currentTime = 0;
            correctSound.play();
            this.revealTile();
            orderCnt++;
            if (value === numTiles) {
                orderCnt = 0;
                setTimeout(() => {
                    alert("You Win!");
                    resetPuzzle();
                }, 3500);
            }
        } else {
            console.log(`Image with value ${this.value} clicked! - Incorrect.`)
            correctSound.currentTime = 0;
            incorrectSound.currentTime = 0;
            incorrectSound.play();
            this.fontColor = 'Red';
            setTimeout(() => {
                this.fontColor = 'White';
            }, 1000); 
        }
    }
}

class Button {
    constructor({ x, y, width, height, text, onClick }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.onClick = onClick;
    }

    draw() {
        // Draw button background
        c.fillStyle = 'grey'; // Button color
        c.fillRect(this.x, this.y, this.width, this.height);

        // Draw button text
        c.fillStyle = 'white'; // Text color
        c.font = `${this.height * 0.7}px Tahoma`; // Font size relative to height
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    containsPoint(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }

    handleClick(mouseX, mouseY) {
        if (this.containsPoint(mouseX, mouseY) && this.onClick) {
            this.onClick();
        }
    }
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    restartButton.handleClick(mouseX, mouseY);
    finishButton.handleClick(mouseX, mouseY);
});

function resetPuzzle() {
    imageTiles.length = 0;
    initializeImageTiles(randomPositions);
}

function initializeImageTiles(positions) {
    for (let i = 0; i < positions.length; i++) {
        imageTiles.push(new ImageTile({
            position: { x: positions[i].x, y: positions[i].y },
            velocity: { x: 0, y: 0 },
            value: i + 1
        }));
    }
}

function generateRandomPositions(numElements, elementWidth, elementHeight, areaWidth, areaHeight, margin) {
    const positions = [];
    while (positions.length < numElements) {
        const x = Math.floor(Math.random() * (areaWidth - elementWidth - 2 * margin) + margin);
        const y = Math.floor(Math.random() * (areaHeight - elementHeight - 2 * margin) + margin);
        if (!positions.some(pos => areRectanglesOverlapping(x, y, pos.x, pos.y, elementWidth, elementHeight))) {
            positions.push({ x, y });
        }
    }
    return positions;
}

function generateCorrectPositions(numRows, numCols, elementWidth, elementHeight, areaWidth, areaHeight) {
    const totalGridWidth = numCols * elementWidth;
    const totalGridHeight = numRows * elementHeight;

    const startX = (areaWidth - totalGridWidth) / 2; // Center horizontally
    const startY = (areaHeight - totalGridHeight) / 2; // Center vertically

    const positions = [];
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = startX + (elementWidth * col);
            const y = startY + (elementHeight * row);
            positions.push({ x, y });
        }
    }
    return positions;
}

function areRectanglesOverlapping(x1, y1, x2, y2, width, height) {
    return (
        x1 < x2 + width &&
        x1 + width > x2 &&
        y1 < y2 + height &&
        y1 + height > y2
    );
}

const restartButton = new Button({
    x: canvas.width / 4 - 50,
    y: canvas.height - 60,
    width: 100,
    height: 40,
    text: "Restart",
    onClick: () => {
        console.log("Restart clicked!");
        resetPuzzle(); // Call your existing reset function
    }
});

const finishButton = new Button({
    x: (3 * canvas.width) / 4 - 50,
    y: canvas.height - 60,
    width: 100,
    height: 40,
    text: "Finish",
    onClick: () => {
        console.log("Finish clicked!");
        alert("Game Finished!"); // Trigger game finish logic
    }
});

const imageTiles = [];
console.log(`Canvas Width: ${canvas.width} | Canvas Height: ${canvas.height}`)
const randomPositions = generateRandomPositions(numTiles, tileWidth, tileHeight, canvas.width, canvas.height, 10);
const correctPositions = generateCorrectPositions(rows, cols, tileWidth, tileHeight, canvas.width, canvas.height);

fullImage.onload = () => {
    console.log(`Full image dimensions: ${fullImage.width}x${fullImage.height}`);
    initializeImageTiles(randomPositions);
    animate();
};

function animate() {
    console.log("Animating")
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    restartButton.draw();
    finishButton.draw();

    imageTiles.forEach(tile => tile.update());
}