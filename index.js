// src index.js

const AUDIO = {
    correct: new Audio('./audio/answer-is-correct.mp3'),
    incorrect: new Audio('./audio/answer-is-wrong.mp3'),
    win: new Audio('./audio/yay-you-win.mp3'),
    levelComplete: new Audio('./audio/level-up.mp3'),

    welcome: new Audio('./audio/welcome.mp3'),
    kelpForest: new Audio('./audio/kelp-forest.mp3'),
    shipwreck: new Audio('./audio/shipwreck.mp3'),
    jellyfish: new Audio('./audio/jellyfish.mp3'),
    coral: new Audio('./audio/coral-reef.mp3'),
    lastSpot: new Audio('./audio/last-spot.mp3'),
    hooray: new Audio('./audio/hooray.mp3'),

    puzzleInstructions: new Audio('./audio/first-puzzle-instructions.mp3'),
    noDolphinHere: new Audio('./audio/no-dolphin-here.mp3')
};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 960;
canvas.height = 640;


const imageTiles = [];
const rows = 2;
const cols = 5;
const puzzleImageWidth = 930;
const puzzleImageHeight = 530;
const tileWidth = puzzleImageWidth / cols;    
const tileHeight = puzzleImageHeight / rows;  
const correctPositions = generateCorrectPositions(rows, cols, tileWidth, tileHeight, canvas.width, canvas.height);
const randomPositions = generateRandomPositions(rows * cols, tileWidth/2, tileHeight/2, canvas.width, canvas.height, 25);


let currentLevel = 0;
let selectingLevel = true;
let orderCnt = 0;
const order = []
for (let i = 0; i < 10; i++) {
    order[i] = i+1;
}
const backgroundImage = new Image();
backgroundImage.src = 'img/sea-background.jpg';
const kelpForestImage = new Image();
kelpForestImage.src = 'img/1-kelp-forest.png';
const shipwreckImage = new Image();
shipwreckImage.src = 'img/2-shipwreck.png';
const jellyfishImage = new Image();
jellyfishImage.src = 'img/3-jellyfish.png';
const coralReefImage = new Image();
coralReefImage.src = 'img/4-coral-reef.png';
const dolphinLagoonImage = new Image();
dolphinLagoonImage.src = 'img/5-dolphin-lagoon.png';

const buttons = setupButtons();
const puzzleLocations = setupPuzzleLocations();

function setupPuzzleLocations() {
    const locationsConfig = [
        { x: canvas.width - 725, y: canvas.height - 615, text: 'Kelp Forest', level: 1, image: kelpForestImage },
        { x: canvas.width - 428, y: canvas.height - 570, text: 'Shipwreck', level: 2, image: shipwreckImage },
        { x: canvas.width - 780, y: canvas.height - 400, text: 'Jellyfish Flats', level: 3, image: jellyfishImage },
        { x: canvas.width - 345, y: canvas.height - 385, text: 'Coral Reef', level: 4, image: coralReefImage },
        { x: canvas.width - 600, y: canvas.height - 200, text: 'Dolphin Lagoon', level: 5, image: dolphinLagoonImage },
    ];

    const locations = locationsConfig.map(config => {
        const location = new PuzzleLocation({
            x: config.x,
            y: config.y,
            text: config.text,
            level: config.level,
            image: config.image,
            onClick: () => startPuzzle(config.level, config.image), 
            context: ctx,
        });
        // Event listener to handle click for this location
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

        location.handleClick(mouseX, mouseY);
        });
        return location;
    });

    return locations;
}
function removeCurrentPuzzle() {
    orderCnt = 0;
    imageTiles.length = 0;
}
function setupButtons() {
    const buttonsConfig = [
        {   x: 50, y: canvas.height - 65, width: 150, height: 50, text: 'Exit', enabled: true, context: ctx, 
            onClick: () => {
                removeCurrentPuzzle();
                selectingLevel = true;
            }
        },
        {   x: canvas.width - 200, y: canvas.height - 65, width: 150, height: 50, text: 'Continue', enabled: false, context: ctx, 
            onClick: () => {
                removeCurrentPuzzle();
                selectingLevel = true;
                currentLevel++;
            }
        },
        {   x: canvas.width/2 - 75, y: canvas.height - 65, width: 150, height: 50, text: 'Restart', enabled: true, context: ctx, 
            onClick: () => {
                removeCurrentPuzzle();
                initializeImageTiles(randomPositions, currentPuzzle.image);
            }
        },
    ];

    const buttons = buttonsConfig.map(config => {
        const button = new Button({
            x: config.x,
            y: config.y,
            width: config.width,
            height: config.height,
            text: config.text,
            enabled: config.enabled,
            context: config.context,
            onClick: config.onClick,
            context: ctx,
        });
        // Event listener to handle click for this button
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

        button.handleClick(mouseX, mouseY);
        });
        return button;
    });

    return buttons;
}
function winSequence() {
    //play voice audio
    setTimeout(() => {
        AUDIO.noDolphinHere.currentTime = 0;
        AUDIO.noDolphinHere.play();
        // enable continue button
        buttons.at(1).enabled = true;
    }, 2500);

    // Trigger Win Animation
    let delay = 0;
    const jumpDuration = 1000;
    const jumpHeight = 40;

    imageTiles.forEach((tile, index) => {
        setTimeout(() => {
            animateTileJump(tile, jumpDuration, jumpHeight, () => {
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
function startPuzzle(level) {
    currentPuzzle = puzzleLocations.find(location => location.level === level)
    initializeImageTiles(randomPositions, currentPuzzle.image);
    selectingLevel = false;
    currentLevel = level;
}

function startingAudio() {
    currentLevel = 1;
    // AUDIO.welcome.play();
    // AUDIO.welcome.addEventListener('ended', () => {
    //     setTimeout(() => {
    //         currentLevel=1;
    //         AUDIO.kelpForest.play();
    //     }, 2000); 
    // });
}

function setupPuzzleTileEventListeners() {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        imageTiles.forEach(tile => {
            if (!tile.isRevealed && containsPoint(mouseX, mouseY, tile.position.x, tile.position.y, tile.width, tile.height)) {
                tile.checkOrder(tile.value);
            }
        });
    });
}

function initializeImageTiles(positions, image) {
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
            image: image,
            imageWidth: puzzleImageWidth,
            imageHeight: puzzleImageHeight
        }));
    }
    setupPuzzleTileEventListeners();
}


function animatePuzzle() {
    // console.log("Animating Puzzle");
    const puzzleAnimation = requestAnimationFrame(() => animatePuzzle());
    if (!selectingLevel){
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        imageTiles.forEach(tile => tile.update());
        buttons.forEach(button => button.draw());
    } else {
        cancelAnimationFrame(puzzleAnimation);
        animateMap();
    }
}

function animateMap() {
    // console.log("Animating");
    const levelSelectAnimation = requestAnimationFrame(() => animateMap());
    if (selectingLevel) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        puzzleLocations.forEach(location => location.draw());
    }
    else {
        cancelAnimationFrame(levelSelectAnimation);
        animatePuzzle();
    }
    
}
startingAudio();
animateMap();

function logGlobalVariables() {
        console.log(selectingLevel)
        console.log(currentLevel)
        setTimeout(logGlobalVariables, 2000); 
}
// logGlobalVariables();






