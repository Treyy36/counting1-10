//src index.js

function initializeConstants(canvas, ctx, basePath) {
    //Audio
    window.AUDIO = {
        correct: new Audio(`${basePath}/audio/answer-is-correct.mp3`),
        incorrect: new Audio(`${basePath}/audio/answer-is-wrong.mp3`),
        win: new Audio(`${basePath}/audio/yay-you-win.mp3`),
        levelComplete: new Audio(`${basePath}/audio/level-up.mp3`),
        audio_0_welcome: new Audio(`${basePath}/audio/finthedolphin-0-welcome.mp3`),
        audio_1_kelp_forest: new Audio(`${basePath}/audio/finthedolphin-1-kelp-forest.mp3`),
        audio_2_click_numbers: new Audio(`${basePath}/audio/finthedolphin-2-click-numbers.mp3`),
        audio_3_no_dolphin_here: new Audio(`${basePath}/audio/finthedolphin-3-no-dolphin-here.mp3`),
        audio_4_shipwreck: new Audio(`${basePath}/audio/finthedolphin-4-shipwreck.mp3`),
        audio_6_keep_searching: new Audio(`${basePath}/audio/finthedolphin-6-keep-searching.mp3`),
        audio_7_jellyfish: new Audio(`${basePath}/audio/finthedolphin-7-jellyfish.mp3`),
        audio_9_still_no_dolphin: new Audio(`${basePath}/audio/finthedolphin-9-still-no-dolphin.mp3`),
        audio_10_coral_reef: new Audio(`${basePath}/audio/finthedolphin-10-coral-reef.mp3`),
        audio_12_keep_searching: new Audio(`${basePath}/audio/finthedolphin-12-keep-searching.mp3`),
        audio_13_check_last_spot: new Audio(`${basePath}/audio/finthedolphin-13-check-last-spot.mp3`),
        audio_15_hooray: new Audio(`${basePath}/audio/finthedolphin-15-hooray.mp3`),
        audio_16_explore_again: new Audio(`${basePath}/audio/finthedolphin-16-explore-again.mp3`),
    };

    // Add the font to the document and make it available for use
    const customFont = new FontFace('CustomFont', `url(${basePath}/fonts/mapsend-font.ttf)`);
    customFont.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        console.log('Custom font loaded successfully.');
    }).catch((error) => {
        console.error('Failed to load custom font:', error);
    });

    window.puzzleLocations = setupPuzzleLocations(canvas, ctx, basePath);
    window.imageTiles = [];
    window.rows = 2;
    window.cols = 5;
    window.puzzleImageWidth = 930;
    window.puzzleImageHeight = 530;
    window.tileWidth = puzzleImageWidth / cols;    
    window.tileHeight = puzzleImageHeight / rows;
    window.correctPositions = generateCorrectPositions(rows, cols, tileWidth, tileHeight, canvas.width, canvas.height);
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
            if (currentLevel == 5) {
                window.location.reload();
            } else {
                removeCurrentPuzzle();
                selectingLevel = true;
                countingText.enabled = true;
    
                switch (currentLevel + 1) {
                    case 2:
                        AUDIO.audio_4_shipwreck.play();
                        currentLevel++;
                        break;
                    case 3:
                        AUDIO.audio_7_jellyfish.play();
                        currentLevel++;
                        break;
                    case 4:
                        AUDIO.audio_10_coral_reef.play();
                        currentLevel++;
                        break;
                    case 5:
                        AUDIO.audio_13_check_last_spot.play();
                        currentLevel++;
                        break;
                }
    
                // setTimeout(() => {
                //     currentLevel++;
                // }, 4000);
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
            imageHeight: puzzleImageHeight,
            enabled: false
        }));
    }
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
                !tile.isRevealed && tile.enabled &&
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

function startPuzzle(level, canvas, ctx) {
    currentPuzzle = puzzleLocations.find(location => location.level === level)
    randomPositions = generateRandomPositions(rows * cols, tileWidth/2, tileHeight/2, canvas.width, canvas.height, 35);
    // // Generate new random positions each time
    // const newRandomPositions = generateRandomPositions(
    //     rows * cols, 
    //     tileWidth / 2, 
    //     tileHeight / 2, 
    //     canvas.width, 
    //     canvas.height, 
    //     35
    // );

    // initializeImageTiles(newRandomPositions, currentPuzzle.image, ctx);

    initializeImageTiles(randomPositions, currentPuzzle.image, ctx);
    selectingLevel = false;
    currentLevel = level;
    if (level == 1) {
        AUDIO.audio_2_click_numbers.currentTime = 0;
        AUDIO.audio_2_click_numbers.play();
    }
    setTimeout(() => {
        imageTiles.forEach(tile => {
            tile.enabled = true;
        });
    }, 500);

}

function setupPuzzleLocations(canvas, ctx, basePath) {
    const kelpForestImage = new Image();
    kelpForestImage.src = `${basePath}/img/1-kelp-forest.png`;
    const shipwreckImage = new Image();
    shipwreckImage.src = `${basePath}/img/2-shipwreck.png`;
    const jellyfishImage = new Image();
    jellyfishImage.src = `${basePath}/img/3-jellyfish.png`;
    const coralReefImage = new Image();
    coralReefImage.src = `${basePath}/img/4-coral-reef.png`;
    const dolphinLagoonImage = new Image();
    dolphinLagoonImage.src = `${basePath}/img/5-dolphin-lagoon.png`;

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
            onClick: () => startPuzzle(config.level, canvas, ctx), 
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


function animatePuzzle(canvas, ctx, basePath) {
    // console.log("Animating Puzzle");
    const puzzleBackgroundImage = new Image();
    puzzleBackgroundImage.src = `${basePath}/img/sea-background-plain.png`;

    const puzzleAnimation = requestAnimationFrame(() => animatePuzzle(canvas, ctx, basePath));
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
        animateMap(canvas, ctx, basePath);
    }
}

function animateMap(canvas, ctx, basePath) {
    // console.log("Animating");
    const backgroundImage = new Image();
    backgroundImage.src = `${basePath}/img/sea-background.png`;

    const levelSelectAnimation = requestAnimationFrame(() => animateMap(canvas, ctx, basePath));
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
        animatePuzzle(canvas, ctx, basePath);
    }
    
}

function startingAudio() {
    // use this first line to bypass the starting audio and skip to any level for testing purposes 
    currentLevel = 1; 
    // AUDIO.audio_0_welcome.play();
    // AUDIO.audio_0_welcome.addEventListener('ended', () => {
    //     AUDIO.audio_1_kelp_forest.play();
    //     AUDIO.audio_1_kelp_forest.addEventListener('ended', () => {
    //         currentLevel = 1;
    //     });
    // });
}

function startTheGame() {

    // Pathing for dev and production
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const basePath = isLocal ? '' : '/game/counting-1-to-10';  // Empty string for local, prefix for hosted

    // Initialize DOM elements
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 960;
    canvas.height = 640;

    // Game setup
    initializeConstants(canvas, ctx, basePath);
    createConfetti(150, canvas); 
    setupPuzzleTileEventListeners(canvas);
    animateMap(canvas, ctx, basePath);


    // Play starting audio
    startingAudio();
}

// Ensure this runs after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    startTheGame();
});