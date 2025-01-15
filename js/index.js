// src index.js

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

function startPuzzle(level) {
    currentPuzzle = puzzleLocations.find(location => location.level === level)
    initializeImageTiles(randomPositions, currentPuzzle.image);
    selectingLevel = false;
    currentLevel = level;
    AUDIO.audio_2_click_numbers.currentTime = 0;
    AUDIO.audio_2_click_numbers.play();
}

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

createConfetti(150); 
function animatePuzzle() {
    // console.log("Animating Puzzle");
    const puzzleAnimation = requestAnimationFrame(() => animatePuzzle());
    if (!selectingLevel){
        ctx.drawImage(puzzleBackgroundImage, 0, 0, canvas.width, canvas.height);
        imageTiles.forEach(tile => tile.update());
        restartButton.enabled = false;
        exitButton.enabled = false;
        continueButton.draw();
        countingText.draw();
        if (lastLevelCompleted) {
            confettiPieces.forEach(drawConfettiPiece);
            updateConfetti();
        }
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
        restartButton.enabled = true;
        exitButton.enabled = true;
        restartButton.draw();
        exitButton.draw();
    }
    else {
        cancelAnimationFrame(levelSelectAnimation);
        animatePuzzle();
    }
    
}
animateMap();

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
startingAudio();








