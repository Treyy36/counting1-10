//src = image-tile.js

import { AUDIO } from '../game-constants.js';
import { correctPositions } from '../game.js';
import { triggerWinAnimation } from '../game.js';

const fullImageWidth = 800;
const fullImageHeight = 300;

const rows = 2; // Number of rows in the puzzle grid
const cols = 5;  // Number of columns in the puzzle grid
const numTiles = rows * cols;
const animationSpeed = 0.05;

let orderCnt = 0;
const order =[]
for (let i = 0; i < numTiles; i++) {
    order[i] = i+1;
}

const smallTileWidth = fullImageWidth / cols / 2;    //80
const smallTileHeight = fullImageHeight / rows / 2;  //75
const tileWidth = fullImageWidth / cols;    //160
const tileHeight = fullImageHeight / rows;  //150


export class ImageTile {
    constructor({ position, velocity, value, context, srcImage }) {
        this.position = position;
        this.velocity = velocity;
        this.value = value;
        this.context = context;
        this.srcImage = srcImage;
        
        this.width = smallTileWidth;
        this.height = smallTileHeight;
        this.isRevealed = false;
        this.resetTile = false;
        this.fontColor = 'white';
        this.animationJump = 0;

        // this.onClick();
    }

    draw() {
        const sx = (this.value-1) % cols * tileWidth //Source X in full image
        const sy = Math.floor((this.value - 1) / cols) * tileHeight;

        // console.log(`Tile ${this.value} | sx: ${sx}, sy: ${sy} | posX: ${this.position.x}, posY: ${this.position.y}`);

        this.context.drawImage(
            this.srcImage, sx, sy, tileWidth, tileHeight, // Source image, to be cut out based on positions and dimensions
            this.position.x, this.position.y, this.width, this.height // New Destination positions and dimension based on above source
        );

        if (!this.isRevealed) {
            this.context.fillStyle = 'rgba(0, 170, 190, 0.8)';
            this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        const fontSize = Math.min(this.width, this.height) * 0.6; // 40% of the smaller tile dimension
        this.context.fillStyle = this.fontColor; // Text color
        this.context.font = `bold ${fontSize}px Tahoma`; // Set dynamic font size
        this.context.textAlign = 'center'; // Center text horizontally
        this.context.textBaseline = 'middle'; // Center text vertically
        this.context.fillText(
            this.value, // The value to display
            this.position.x + this.width / 2, // X: center of the tile
            this.position.y + this.height / 2 - this.animationJump +3 // Y: center of the tile
        );
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

    checkOrder(value) {
        console.log(`Tile value: ${this.value} and the current order is: ${order[orderCnt]}`)
        if (value === order[orderCnt]) {
            console.log(`Image with value ${this.value} clicked! - Correct!`)
            AUDIO.correct.currentTime = 0;
            AUDIO.correct.play();
            this.isRevealed = true;
            orderCnt++;
            if (value === numTiles) {
                orderCnt = 0;
                setTimeout(() => {
                    AUDIO.win.currentTime = 0;
                    AUDIO.win.play();
                    triggerWinAnimation();
                }, 3000);
            }
        } else {
            console.log(`Image with value ${this.value} clicked! - Incorrect.`)
            AUDIO.incorrect.currentTime = 0;
            AUDIO.incorrect.play();
            this.fontColor = 'Red';
            setTimeout(() => {
                this.fontColor = 'White';
            }, 1000); 
        }
    }
}

