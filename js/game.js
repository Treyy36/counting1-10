// -------------------- IMPORTS --------------------
import * as Utils from './utils.js';
import { Button } from './components/button.js';
import { ImageTile } from './components/image-tile.js';
import { AUDIO } from './game-constants.js';
// import { incrementCurrentLevel } from './index.js';
// -------------------- EXPORTS --------------------
export let correctPositions;

export let orderCnt = 0;

export function resetOrderCnt() {
    orderCnt = 0;
}

export function incrementOrderCnt() {
    orderCnt++;
}

export  let puzzleWin = false;
export function triggerWinAnimation() {
    //play voice audio
    setTimeout(() => {
        AUDIO.noDolphinHere.currentTime = 0;
        AUDIO.noDolphinHere.play();
    }, 2500);
    // enable continue button
    puzzleWin = true;

    // Trigger Win Animation
    let delay = 0;
    const jumpDuration = 1000;
    const jumpHeight = 40;

    imageTiles.forEach((tile, index) => {
        setTimeout(() => {
            Utils.animateTileJump(tile, jumpDuration, jumpHeight, () => {
                if (index === imageTiles.length - 1) {
                    setTimeout(() => {
                        // Make all of the tiles numbers transparents so you can see full image
                        imageTiles.forEach(tile => {
                            tile.fontColor = 'rgba(0, 0, 0, 0)';
                            tile.borderColor = 'rgba(0, 0, 0, 0)';
                            tile.drawFinalBorder = true;
                        });
                    }, 1000);
                }
            });
        }, delay);

        delay += 100;
    });
}

// -------------------- STATE VARIABLES --------------------
const imageTiles = [];
// -------------------- MAIN LOGIC --------------------
document.addEventListener('DOMContentLoaded', () => {
    AUDIO.puzzleInstructions.currentTime = 0;
    AUDIO.puzzleInstructions.play();
    // imported params
    const params = new URLSearchParams(window.location.search);
    const imageSrc = decodeURIComponent(params.get('imageSrc'));
    console.log
    const puzzleImageWidth = parseInt(params.get('imageSrcWidth'), 10);
    const puzzleImageHeight = parseInt(params.get('imageSrcHeight'), 10);
    let currentLevel = parseInt(params.get('currentLevel'), 10);

    // constants
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 960;
    canvas.height = 640;

    const rows = 2;
    const cols = 5;
    const tileWidth = puzzleImageWidth / cols;    
    const tileHeight = puzzleImageHeight / rows;  

    const backgroundImage = null;
    // const backgroundImage = new Image();
    // backgroundImage.src = 'img/sea-background.jpg';

    // // Initialize positions
    correctPositions = Utils.generateCorrectPositions(rows, cols, tileWidth, tileHeight, canvas.width, canvas.height);
    const randomPositions = Utils.generateRandomPositions(rows * cols, tileWidth/2, tileHeight/2, canvas.width, canvas.height, 25);

    function initializeImageTiles(positions) {
        if (!Array.isArray(positions) || positions.length !== 10) {
            return { error: "Positions array must contain exactly 10 elements." };
        }
        for (let i = 0; i < positions.length; i++) {
            imageTiles.push(new ImageTile({
                position: { x: positions[i].x, y: positions[i].y },
                velocity: { x: 0, y: 0 },
                value: i + 1,
                context: ctx,
                rows: rows,
                cols: cols,
                srcImage: puzzleImage,
                srcImageWidth: puzzleImageWidth,
                srcImageHeight: puzzleImageHeight
            }));
        }
    }

    function resetPuzzle() {
        location.reload();
    }

    function setupButtons() {
        const exitButton = new Button({
            x: 50,
            y: canvas.height - 65,
            width: 150,
            height: 50,
            text: 'Exit',
            isenabled: true,
            onClick: () => {
                window.location.href = 'index.html'; 
            },
            context: ctx,
        });
        const finishButton = new Button({
            x: canvas.width - 200,
            y: canvas.height - 65,
            width: 150,
            height: 50,
            text: 'Continue',
            isenabled: false,
            onClick: () => {
                console.log(currentLevel)
                currentLevel++;
                const levelInfo = `?currentLevel=${encodeURIComponent(currentLevel)}`;
                window.location.href = `index.html${levelInfo}`;
            },
            context: ctx,
        });
        const restartButton = new Button({
            x: canvas.width/2 - 75,
            y: canvas.height - 65,
            width: 150,
            height: 50,
            text: 'Restart',
            isenabled: true,
            onClick: () => resetPuzzle(),
            context: ctx,
        });
        return { restartButton, finishButton, exitButton };
    }

    function setupEventListeners(buttons) {
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            buttons.exitButton.handleClick(mouseX, mouseY);
            buttons.restartButton.handleClick(mouseX, mouseY);
            buttons.finishButton.handleClick(mouseX, mouseY);

            imageTiles.forEach(tile => {
                if (!tile.isRevealed && Utils.containsPoint(mouseX, mouseY, tile.position.x, tile.position.y, tile.width, tile.height)) {
                    tile.checkOrder(tile.value);
                }
            });
        });
    }

    function animate(buttons) {
        requestAnimationFrame(() => animate(buttons));
        // Draw the background image first
        if (backgroundImage && backgroundImage.complete) {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else {
            // Optional fallback if the image is not loaded yet
            ctx.fillStyle = '#bdd0c0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        buttons.exitButton.draw();
        buttons.restartButton.draw();
        buttons.finishButton.draw();

        imageTiles.forEach(tile => tile.update());
    }

    const puzzleImage = new Image();
    puzzleImage.src = imageSrc;

    function startPuzzle() {
        puzzleImage.onload = () => {
            initializeImageTiles(randomPositions);
            const buttons = setupButtons();
            setupEventListeners(buttons);
            animate(buttons);
        };
    }

    startPuzzle();
});