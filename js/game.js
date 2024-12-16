// src = game.js

//imports 
import * as Utils from './utils.js';
import { Button } from './components/button.js';
import { ImageTile } from './components/image-tile.js'

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 960;
canvas.height = 640;

const rows = 2; // Number of rows in the puzzle grid
const cols = 5;  // Number of columns in the puzzle grid
const numTiles = rows * cols;

const fullImageSrc = "img/Count_10_Game_Full_Puzzle_Image_1_resized.jpg"; // Full puzzle image
const fullImageWidth = 800;
const fullImageHeight = 300;
let fullImage = new Image();
fullImage.src = fullImageSrc;

const tileWidth = fullImageWidth / cols;    //160
const tileHeight = fullImageHeight / rows;  //150

let orderCnt = 0;
const order =[]
for (let i = 0; i < numTiles; i++) {
    order[i] = i+1;
}
console.log(order)

export function triggerWinAnimation() {
    console.log("Here")
    let delay = 0;
    const jumpDuration = 1000; // Duration of each jump in ms
    const jumpHeight = 40; // Height of the jump in pixels

    imageTiles.forEach((tile, index) => {
        setTimeout(() => {
            Utils.animateTileJump(tile, jumpDuration, jumpHeight, () => {
                if (index === imageTiles.length - 1) {
                    // After all jumps complete, make the text transparent
                    setTimeout(() => {
                        imageTiles.forEach(tile => {
                            tile.fontColor = 'rgba(0, 0, 0, 0)';
                        });
                    }, 1500)
                }
            });
        }, delay);

        delay += 100; // Add delay for the wave effect
    });
}

function resetPuzzle() {
    imageTiles.length = 0;
    initializeImageTiles(randomPositions);
}

function initializeImageTiles(positions) {
    for (let i = 0; i < positions.length; i++) {
        imageTiles.push(new ImageTile({
            position: { x: positions[i].x, y: positions[i].y },
            velocity: { x: 0, y: 0 },
            value: i + 1,
            context: ctx,
            srcImage: fullImage
        }));
    }
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
    },
    context: ctx
});

const finishButton = new Button({
    x: (3 * canvas.width) / 4 - 50,
    y: canvas.height - 60,
    width: 100,
    height: 40,
    text: "Finish",
    onClick: () => {
        console.log("Finish clicked!");
        window.location.href = 'index.html'
    },
    context: ctx
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the click is on a button
    restartButton.handleClick(mouseX, mouseY);
    finishButton.handleClick(mouseX, mouseY);

    // Check if the click is on any active tile
    imageTiles.forEach(tile => { 
        if (!tile.isRevealed && Utils.containsPoint(mouseX, mouseY, tile.position.x, tile.position.y, tile.width, tile.height)) {
            tile.checkOrder(tile.value); // Process the tile click
        }
    });
});

const imageTiles = [];
const randomPositions = Utils.generateRandomPositions(numTiles, tileWidth, tileHeight, canvas.width, canvas.height, 10);
export const correctPositions = Utils.generateCorrectPositions(rows, cols, tileWidth, tileHeight, canvas.width, canvas.height);

fullImage.onload = () => {
    console.log(`Full image dimensions: ${fullImage.width}x${fullImage.height}`);
    initializeImageTiles(randomPositions);
    animate();
};

function animate() {
    console.log("Animating")
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    restartButton.draw();
    finishButton.draw();

    imageTiles.forEach(tile => tile.update());
}
class Game {
    constructor(rows, cols, imageSrc) {

        this.rows = rows;
        this.cols = cols;
        this.imageSrc = imageSrc;

        this.numTiles = rows * cols;
        this.canvas = document.querySelector('canvas');
        this.canvas.width = 960;
        this.canvas.height = 640;
        this.context = this.canvas.getContext('2d');
        this.tiles = [];
        this.init();

        this.fullImageWidth = 800;
        this.fullImageHeight = 300;
        let fullImage = new Image();
        this.fullImage.src = imageSrc;

        const tileWidth = fullImageWidth / cols;    //160
        const tileHeight = fullImageHeight / rows;  //150

        let orderCnt = 0;

    }

    init() {
        this.canvas.width = 960;
        this.canvas.height = 640;
        this.initializeTiles();
        this.bindEvents();
        this.animate();
    }

    initializeImageTiles(positions) {
        for (let i = 0; i < positions.length; i++) {
            imageTiles.push(new ImageTile({
                position: { x: positions[i].x, y: positions[i].y },
                velocity: { x: 0, y: 0 },
                value: i + 1,
                context: ctx,
                srcImage: fullImage
            }));
        }
    }

    bindEvents() {
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
        
            // Check if the click is on a button
            restartButton.handleClick(mouseX, mouseY);
            finishButton.handleClick(mouseX, mouseY);
        
            // Check if the click is on any active tile
            imageTiles.forEach(tile => { 
                if (!tile.isRevealed && Utils.containsPoint(mouseX, mouseY, tile.position.x, tile.position.y, tile.width, tile.height)) {
                    tile.checkOrder(tile.value); // Process the tile click
                }
            });
        });
    }

    animate() {
        console.log("Animating")
        requestAnimationFrame(animate);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        restartButton.draw();
        finishButton.draw();
    
        imageTiles.forEach(tile => tile.update());
    }
}
