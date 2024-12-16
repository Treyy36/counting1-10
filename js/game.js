// -------------------- IMPORTS --------------------
import * as Utils from './utils.js';
import { Button } from './components/button.js';
import { ImageTile } from './components/image-tile.js';

// -------------------- EXPORTS --------------------
export let correctPositions;

export let orderCnt = 0;

export function resetOrderCnt() {
    orderCnt = 0;
}

export function incrementOrderCnt() {
    orderCnt++;
}

export function triggerWinAnimation() {
    let delay = 0;
    const jumpDuration = 1000;
    const jumpHeight = 40;

    imageTiles.forEach((tile, index) => {
        setTimeout(() => {
            Utils.animateTileJump(tile, jumpDuration, jumpHeight, () => {
                if (index === imageTiles.length - 1) {
                    setTimeout(() => {
                        imageTiles.forEach(tile => {
                            tile.fontColor = 'rgba(0, 0, 0, 0)';
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
    // imported params
    const params = new URLSearchParams(window.location.search);
    const imageSrc = decodeURIComponent(params.get('imageSrc'));
    const puzzleImageWidth = parseInt(params.get('imageSrcWidth'), 10);
    const puzzleImageHeight = parseInt(params.get('imageSrcHeight'), 10);

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
    // backgroundImage.src = 'img/blue-gradient-background.jpg';

    // // Initialize positions
    correctPositions = Utils.generateCorrectPositions(rows, cols, tileWidth, tileHeight, canvas.width, canvas.height);
    const randomPositions = Utils.generateRandomPositions(rows * cols, tileWidth/2, tileHeight/2, canvas.width, canvas.height, 10);

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
        // resetOrderCnt();
        // imageTiles.length = 0;
        // initializeImageTiles(randomPositions);
    }

    function setupButtons() {
        const restartButton = new Button({
            x: canvas.width / 4 - 50,
            y: canvas.height - 60,
            width: 120,
            height: 40,
            text: 'Restart',
            onClick: () => resetPuzzle(),
            context: ctx,
        });

        const finishButton = new Button({
            x: (3 * canvas.width) / 4 - 50,
            y: canvas.height - 60,
            width: 120,
            height: 40,
            text: 'Continue',
            onClick: () => (window.location.href = 'index.html'),
            context: ctx,
        });

        return { restartButton, finishButton };
    }

    function setupEventListeners(buttons) {
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

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
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

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