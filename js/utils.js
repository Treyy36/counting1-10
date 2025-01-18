// src = utils.js

function logGlobalVariables() {
    console.log(selectingLevel)
    console.log(currentLevel)
    setTimeout(logGlobalVariables, 2000); 
}
// logGlobalVariables();

const customFont = new FontFace('CustomFont', 'url(/fonts/mapsend-font.ttf)');
const defaultFont = 'Tahoma, sans-serif';
const customOrange = '#e68a3f'
const customYellow = '#f2e28c'

// Add the font to the document and make it available for use
customFont.load().then((loadedFont) => {
    document.fonts.add(loadedFont);
    console.log('Custom font loaded successfully.');
}).catch((error) => {
    console.error('Failed to load custom font:', error);
});

const correctMaxElementHeight = 320; 
const correctMaxElementWidth = 192;

const randMaxElementHeight = 250; 
const randMaxElementWidth = 150;
function areRectanglesOverlapping(x1, y1, x2, y2, width, height) {
    return (
        x1 < x2 + width &&
        x1 + width > x2 &&
        y1 < y2 + height &&
        y1 + height > y2
    );
}

// Checks if the mouse has clicked in the container
 function containsPoint(mouseX, mouseY, containerX, containerY, containerWidth, containerHeight ) {
    return (
        mouseX >= containerX && mouseX <= containerX + containerWidth &&
        mouseY >= containerY &&mouseY <= containerY + containerHeight
    );
}

 function generateRandomPositions(numElements, elementWidth, elementHeight, areaWidth, areaHeight, margin) {
    // Check if element size exceeds the maximum allowed dimensions
    if (elementWidth > randMaxElementWidth || elementHeight > randMaxElementHeight) {
        console.log(`Rand. Element width and height are: ${elementWidth}, ${elementHeight}`)
        return { error: "Element size is too large to fit within the area" };
    }
    const positions = [];
    while (positions.length < numElements) {
        const x = Math.floor(Math.random() * (areaWidth - elementWidth - 2 * margin) + margin);
        const y = Math.floor(Math.random() * (areaHeight - elementHeight - 2 * margin) + margin);
        if (!positions.some(pos => areRectanglesOverlapping(x, y, pos.x, pos.y, elementWidth, elementHeight))) {
            positions.push({ x, y });
        }
    }
    if (positions.length !== numElements) {
        console.error("Error: The positions array must contain exactly 10 elements.");
        return { error: "Positions array must contain exactly 10 elements." };
    }
    return positions;
}

 function generateCorrectPositions(numRows, numCols, elementWidth, elementHeight, areaWidth, areaHeight) {
    
    if (elementWidth > correctMaxElementHeight || elementHeight > correctMaxElementHeight) {
        console.log(`Corr. Element width and height are: ${elementWidth}, ${elementHeight}`)
        return { error: "Element size is too large to fit within the area" };
    }
    const totalGridWidth = numCols * elementWidth;
    const totalGridHeight = numRows * elementHeight;

    const startX = (areaWidth - totalGridWidth) / 2; // Center horizontally
    const startY = (40); //15px margin from top

    const positions = [];
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = startX + (elementWidth * col);
            const y = startY + (elementHeight * row);
            positions.push({ x, y });
        }
    }
    return positions;
}

 function animateTileJump(tile, duration, jumpHeight, onComplete) {
    let startTime = null;

    function animate(time) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        
        // Calculate the jump progress (0 to 1)
        const progress = Math.min(elapsed / duration, 1);

        // Create a smooth jump using a sine wave for better visual effect
        tile.animationJump = Math.sin(progress * Math.PI) * jumpHeight;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            tile.animationJump = 0; // Reset jump offset
            if (onComplete) onComplete();
        }
    }

    requestAnimationFrame(animate);
}

function removeCurrentPuzzle() {
    orderCnt = 0;
    imageTiles.length = 0;
    continueButton.enabled = false; // reset continue button
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
                lastLevelCompleted = true;
                AUDIO.audio_15_hooray.play();
                AUDIO.audio_15_hooray.addEventListener('ended', () => {
                    AUDIO.audio_16_explore_again.play()
                });
                break;
        }
    }, 2500);
    // enable continue button
    setTimeout(() => {
       continueButton.enabled = true;
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
                        countingText.enabled = false;
                    }, 1000);
                }
            });
        }, delay);

        delay += 100;
    });
}

// Generate confetti pieces
function createConfetti(count, canvas) {
    for (let i = 0; i < count; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width, // Random horizontal position
            y: Math.random() * canvas.height - canvas.height, // Start above the canvas
            width: Math.random() * 10 + 5, // Random width between 5 and 15
            height: Math.random() * 10 + 5, // Random height between 5 and 15
            color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
            rotation: Math.random() * 360, // Random initial rotation
            rotationSpeed: Math.random() * 5 - 2.5, // Random rotation speed
            speed: Math.random() * 2 + 1, // Random fall speed
            sway: Math.random() * 2 - 1 // Random horizontal sway
        });
    }
}

// Draw a single confetti piece
function drawConfettiPiece(piece, ctx) {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate((piece.rotation * Math.PI) / 180);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
    ctx.restore();
}

// Update the position and rotation of the confetti pieces
function updateConfetti(canvas) {
    confettiPieces.forEach(piece => {
        piece.y += piece.speed; // Move down
        piece.x += piece.sway; // Horizontal sway
        piece.rotation += piece.rotationSpeed; // Rotate

        // Reset confetti piece if it falls off the canvas
        if (piece.y > canvas.height) {
            piece.y = 0 - piece.height;
            piece.x = Math.random() * canvas.width;
        }
    });
}
// function setupButtons() {
//     const buttonsConfig = [
//         {   x: 50, y: canvas.height - 65, width: 150, height: 50, text: 'Exit', enabled: true, context: ctx, 
//             onClick: () => {
//                 removeCurrentPuzzle();
//                 selectingLevel = true;
//             }
//         },
//         {   x: canvas.width - 200, y: canvas.height - 65, width: 150, height: 50, text: 'Continue', enabled: false, context: ctx, 
//             onClick: () => {
//                 removeCurrentPuzzle();
//                 selectingLevel = true;
//                 switch (currentLevel+1) {
//                     case 2:
//                         AUDIO.audio_4_shipwreck.play();
//                         break;
//                     case 3:
//                         AUDIO.audio_7_jellyfish.play();
//                         break;
//                     case 4:
//                         AUDIO.audio_10_coral_reef.play();
//                         break;
//                     case 5:
//                         AUDIO.audio_13_check_last_spot.play();
//                         break;
//                 }
//                 setTimeout(() => {
//                     currentLevel++;
//                 }, 4000);
//             }
//         },
//         {   x: canvas.width/2 - 75, y: canvas.height - 65, width: 150, height: 50, text: 'Restart', enabled: true, context: ctx, 
//             onClick: () => {
//                 removeCurrentPuzzle();
//                 initializeImageTiles(randomPositions, currentPuzzle.image);
//             }
//         },
//     ];

//     const buttons = buttonsConfig.map(config => {
//         const button = new Button({
//             x: config.x,
//             y: config.y,
//             width: config.width,
//             height: config.height,
//             text: config.text,
//             enabled: config.enabled,
//             context: config.context,
//             onClick: config.onClick,
//             context: ctx,
//         });
//         // Event listener to handle click for this button
//         canvas.addEventListener('click', (event) => {
//             const rect = canvas.getBoundingClientRect();
//             const mouseX = event.clientX - rect.left;
//             const mouseY = event.clientY - rect.top;

//         button.handleClick(mouseX, mouseY);
//         });
//         return button;
//     });

//     return buttons;
// }