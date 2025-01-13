// src = utils.js

// // Calculate available space after margins
// const maxElementWidth = availableWidth / Math.ceil(Math.sqrt(numElements)); // Use the square root to fit in rows and columns
// const maxElementHeight = availableHeight / Math.ceil(Math.sqrt(numElements));
// const availableWidth = areaWidth - 2 * margin;
// const availableHeight = areaHeight - 2 * margin;

const customFont = new FontFace('CustomFont', 'url(/fonts/mapsend-font.ttf)');
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