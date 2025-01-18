//src index.js

function startTheGame() {
    // Initialize DOM elements
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 960;
    canvas.height = 640;

    // Game setup
    initializeConstants(canvas, ctx);
    createConfetti(150, canvas); 
    setupPuzzleTileEventListeners(canvas);
    animateMap(canvas, ctx);


    // Play starting audio
    startingAudio();
}

function initializeConstants(canvas, ctx) {
    //Audio
    window.AUDIO = {
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
    window.puzzleLocations = setupPuzzleLocations(canvas, ctx);
    window.imageTiles = [];
    window.rows = 2;
    window.cols = 5;
    window.puzzleImageWidth = 930;
    window.puzzleImageHeight = 530;
    window.tileWidth = puzzleImageWidth / cols;    
    window.tileHeight = puzzleImageHeight / rows;
    window.correctPositions = generateCorrectPositions(rows, cols, tileWidth, tileHeight, canvas.width, canvas.height);
    window.randomPositions = generateRandomPositions(rows * cols, tileWidth/2, tileHeight/2, canvas.width, canvas.height, 35);
    window.confettiPieces = [];
    window.lastLevelCompleted = false;
    window.selectingLevel = true;
    window.currentLevel = 0;
    window.orderCnt = 0;
    window.order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    window.countingText = new Title({
        x: canvas.width/2 - 250/2,
        y: 275,
        width: 250, 
        height: -278,
        text: 'Click the numbers from 1 to 10!',
        context: ctx,
    });
    window.continueButton = new Button({
        x: canvas.width/2 - 50,
        y: canvas.height - 55,
        width: 90,
        height: 45,
        text: '\u2192',
        secondaryText: 'Continue',
        enabled: false,
        context: ctx,
        onClick: () => {
            console.log(currentLevel);
            if (currentLevel == 5) {
                window.location.reload();
            } else {
                removeCurrentPuzzle();
                selectingLevel = true;
                countingText.enabled = true;
    
                switch (currentLevel + 1) {
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
            
        }
    });
    window.exitButton = new Button({
        x: canvas.width - 90,
        y: canvas.height - 80,
        width: 80,
        height: 55,
        text: 'x',
        secondaryText: 'Exit',
        enabled: true,
        context: ctx,
        onClick: () => {
            window.close();
        }
    });
    window.restartButton = new Button({
        x: canvas.width - 950,
        y: canvas.height - 80,
        width: 80,
        height: 55,
        text: '\u27F3',
        secondaryText: 'Restart',
        enabled: true,
        context: ctx,
        onClick: () => {
            window.location.reload();
        }
    });
    // Add other initialization logic here
}

function initializeImageTiles(positions, image, ctx) {
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
    // setupPuzzleTileEventListeners();
}

// Wrap event listener setups in functions
function setupPuzzleTileEventListeners(canvas) {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        continueButton.handleClick(mouseX, mouseY);
        restartButton.handleClick(mouseX, mouseY);
        exitButton.handleClick(mouseX, mouseY);
        imageTiles.forEach((tile) => {
            if (
                !tile.isRevealed &&
                containsPoint(
                    mouseX,
                    mouseY,
                    tile.position.x,
                    tile.position.y,
                    tile.width,
                    tile.height
                )
            ) {
                tile.checkOrder(tile.value);
            }
        });
    });
}

function startPuzzle(level, ctx) {
    currentPuzzle = puzzleLocations.find(location => location.level === level)
    initializeImageTiles(randomPositions, currentPuzzle.image, ctx);
    selectingLevel = false;
    currentLevel = level;
    AUDIO.audio_2_click_numbers.currentTime = 0;
    AUDIO.audio_2_click_numbers.play();
}

function setupPuzzleLocations(canvas, ctx) {
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
            onClick: () => startPuzzle(config.level, ctx), 
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


function animatePuzzle(canvas, ctx) {
    // console.log("Animating Puzzle");
    const puzzleBackgroundImage = new Image();
    puzzleBackgroundImage.src = 'img/sea-background-plain.png';

    const puzzleAnimation = requestAnimationFrame(() => animatePuzzle(canvas, ctx));
    if (!selectingLevel){
        ctx.drawImage(puzzleBackgroundImage, 0, 0, canvas.width, canvas.height);
        imageTiles.forEach(tile => tile.update());
        restartButton.enabled = false;
        exitButton.enabled = false;
        continueButton.draw();
        countingText.draw();
        if (lastLevelCompleted) {
            confettiPieces.forEach(piece => {
                drawConfettiPiece(piece, ctx);  
            });
            updateConfetti(canvas);
        }
    } else {
        cancelAnimationFrame(puzzleAnimation);
        animateMap(canvas, ctx);
    }
}

function animateMap(canvas, ctx) {
    // console.log("Animating");
    const backgroundImage = new Image();
    backgroundImage.src = 'img/sea-background.png';

    const levelSelectAnimation = requestAnimationFrame(() => animateMap(canvas, ctx));
    if (selectingLevel) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        puzzleLocations.forEach(location => location.draw());
        restartButton.enabled = true;
        exitButton.enabled = true;
        restartButton.draw(canvas, ctx);
        exitButton.draw(canvas, ctx);
    }
    else {
        cancelAnimationFrame(levelSelectAnimation);
        animatePuzzle(canvas, ctx);
    }
    
}

function startingAudio() {
    // use this first line to bypass the starting audio and skip to any level for testing purposes 
    // currentLevel = 5; 
    AUDIO.audio_0_welcome.play();
    AUDIO.audio_0_welcome.addEventListener('ended', () => {
        AUDIO.audio_1_kelp_forest.play();
        AUDIO.audio_1_kelp_forest.addEventListener('ended', () => {
            currentLevel = 1;
        });
    });
}

// Ensure this runs after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    startTheGame();
});