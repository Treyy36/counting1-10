//src = image-tile.js

import { AUDIO } from '../game-constants.js';
import { correctPositions, orderCnt, resetOrderCnt, incrementOrderCnt } from '../game.js';
import { triggerWinAnimation } from '../game.js';

const animationSpeed = 0.05;

export class ImageTile {
    constructor({ position, velocity, value, context, rows, cols, srcImage, srcImageWidth, srcImageHeight }) {
        this.position = position;
        this.velocity = velocity;
        this.value = value;
        this.context = context;
        this.rows = rows;
        this.cols = cols;
        this.srcImage = srcImage;

        this.numTiles = rows * cols;
        this.tileHeight = srcImageHeight / rows;
        this.tileWidth = srcImageWidth / cols;
        
        this.width = this.tileHeight / 2;
        this.height = this.tileWidth / 2;
        this.isRevealed = false;
        this.resetTile = false;
        this.fontColor = 'white';
        this.animationJump = 0;
        this.order = this.createOrderArray(this.numTiles);
    }

    createOrderArray(numTiles) {
        const order = []
        for (let i = 0; i < numTiles; i++) {
            order[i] = i+1;
        }
        return order;
    }

    draw() {
        const sx = (this.value-1) % this.cols * this.tileWidth //Source X in full image
        const sy = Math.floor((this.value - 1) / this.cols) * this.tileHeight;

        // console.log(`Tile ${this.value} | sx: ${sx}, sy: ${sy} | posX: ${this.position.x}, posY: ${this.position.y}`);

        this.context.drawImage(
            this.srcImage, sx, sy, this.tileWidth, this.tileHeight, // Source image, to be cut out based on positions and dimensions
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
            this.resizeToTarget(this.tileWidth, this.tileHeight, animationSpeed);
        }

        if (this.resetTile) {
            this.draw()
            const targetPosition = randomPositions[this.value - 1];
            this.moveToTarget(targetPosition.x, targetPosition.y, animationSpeed);
        }
    }

    checkOrder(value) {
        console.log(`Tile value: ${this.value} and the current order is: ${this.order[orderCnt]}`)
        if (value === this.order[orderCnt]) {
            console.log(`Image with value ${this.value} clicked! - Correct!`)
            AUDIO.correct.currentTime = 0;
            AUDIO.correct.play();
            this.isRevealed = true;
            incrementOrderCnt();
            if (value === this.numTiles) {
                resetOrderCnt();
                setTimeout(() => {
                    triggerWinAnimation();
                }, 2500);
                setTimeout(() => {
                AUDIO.levelComplete.currentTime = 0;
                AUDIO.levelComplete.play();
                }, 2000);
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

