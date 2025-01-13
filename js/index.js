// src index.js

const AUDIO = {
    correct: new Audio('./audio/answer-is-correct.mp3'),
    incorrect: new Audio('./audio/answer-is-wrong.mp3'),
    win: new Audio('./audio/yay-you-win.mp3'),
    levelComplete: new Audio('./audio/level-up.mp3'),

    audio_0_welcome: new Audio('./audio/finthedolphin-0-welcome.mp3'),
    audio_1_kelp_forest: new Audio('./audio/finthedolphin-1-kelp-forest.mp3'),
    audio_2_click_numbers: new Audio('./audio/finthedolphin-2-click-numbers.mp3'),
    audio_3_no_dolphin_here: new Audio('./audio/finthedolphin-3-no-dolphin-here.mp3'),
    audio_4_shipwreck: new Audio('./audio/finthedolphin-4-shipwreck.mp3'),
    audio_6_keep_searching: new Audio('./audio/finthedolphin-6-keep-searching.mp3'),
    audio_7_jellyfish: new Audio('./audio/finthedolphin-7-jellyfish.mp3'),
    audio_9_still_no_dolphin: new Audio('./audio/finthedolphin-9-still-no-dolphin.mp3'),
    audio_10_coral_reef: new Audio('./audio/finthedolphin-10-coral-reef.mp3'),
    audio_12_keep_searching: new Audio('./audio/finthedolphin-12-keep-searching.mp3'),
    audio_13_check_last_spot: new Audio('./audio/finthedolphin-13-check-last-spot.mp3'),
    audio_15_hooray: new Audio('./audio/finthedolphin-15-hooray.mp3'),
    audio_16_explore_again: new Audio('./audio/finthedolphin-16-explore-again.mp3'),
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
const randomPositions = generateRandomPositions(rows * cols, tileWidth/2, tileHeight/2, canvas.width, canvas.height, 35);


let currentLevel = 0;
let selectingLevel = true;
let orderCnt = 0;
const order = []
for (let i = 0; i < 10; i++) {
    order[i] = i+1;
}
const backgroundImage = new Image();
backgroundImage.src = 'img/sea-background.png';
const puzzleBackgroundImage = new Image();
puzzleBackgroundImage.src = 'img/sea-background-plain.png';
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
const countingText = new Title({
    x: canvas.width/2 - 250/2,
    y: 275,
    width: 250,
    height: -275,
    text: 'Click the numbers from 1 to 10!',
    context: ctx,
})
const buttons = setupButtons();
const puzzleLocations = setupPuzzleLocations();

function setupPuzzleLocations() {
    const locationsConfig = [
        { x: canvas.width - 605, y: canvas.height - 505, text: 'Kelp Forest', level: 1, image: kelpForestImage },
        { x: canvas.width - 375, y: canvas.height - 185, text: 'Shipwreck', level: 2, image: shipwreckImage },
        { x: canvas.width - 700, y: canvas.height - 230, text: 'Jellyfish Flats', level: 3, image: jellyfishImage },
        { x: canvas.width - 825, y: canvas.height - 385, text: 'Coral Reef', level: 4, image: coralReefImage },
        { x: canvas.width - 473, y: canvas.height - 367, text: 'Dolphin Lagoon', level: 5, image: dolphinLagoonImage },
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
            if (!selectingLevel) return; // Ignore clicks if not in level selection mode
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
    buttons.at(1).enabled = false; // reset continue button
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
                switch (currentLevel+1) {
                    case 2:
                        AUDIO.audio_4_shipwreck.play();
                        break;
                    case 3:
                        AUDIO.audio_7_jellyfish.play();
                        break;
                    case 4:
                        AUDIO.audio_10_coral_reef.play();
                        break;
                    case 5:
                        AUDIO.audio_13_check_last_spot.play();
                        break;
                }
                setTimeout(() => {
                    currentLevel++;
                }, 4000);
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
        switch (currentLevel) {
            case 1: 
                AUDIO.audio_3_no_dolphin_here.play();
                break;
            case 2:
                AUDIO.audio_6_keep_searching.play();
                break;
            case 3:
                AUDIO.audio_9_still_no_dolphin.play();
                break;
            case 4:
                AUDIO.audio_12_keep_searching.play();
                break;
            case 5:
                AUDIO.audio_15_hooray.play();
                AUDIO.audio_15_hooray.addEventListener('ended', () => {
                    AUDIO.audio_16_explore_again.play()
                });
                break;
        }
    }, 2500);
    // enable continue button
    setTimeout(() => {
        buttons.at(1).enabled = true;
    }, 6000)

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
    AUDIO.audio_2_click_numbers.currentTime = 0;
    AUDIO.audio_2_click_numbers.play();
}

function startingAudio() {
    // currentLevel = 4;
    AUDIO.audio_0_welcome.play();
    AUDIO.audio_0_welcome.addEventListener('ended', () => {
        AUDIO.audio_1_kelp_forest.play();
        AUDIO.audio_1_kelp_forest.addEventListener('ended', () => {
            currentLevel = 1;
        });
    });
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
        ctx.drawImage(puzzleBackgroundImage, 0, 0, canvas.width, canvas.height);
        imageTiles.forEach(tile => tile.update());
        buttons.forEach(button => button.draw());
        countingText.draw();
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






