// src = utils.js

function areRectanglesOverlapping(x1, y1, x2, y2, width, height) {
    return (
        x1 < x2 + width &&
        x1 + width > x2 &&
        y1 < y2 + height &&
        y1 + height > y2
    );
}

// Checks if the mouse has clicked in the container
export function containsPoint(mouseX, mouseY, containerX, containerY, containerWidth, containerHeight ) {
    return (
        mouseX >= containerX && mouseX <= containerX + containerWidth &&
        mouseY >= containerY &&mouseY <= containerY + containerHeight
    );
}

export function generateRandomPositions(numElements, elementWidth, elementHeight, areaWidth, areaHeight, margin) {
    const positions = [];
    while (positions.length < numElements) {
        const x = Math.floor(Math.random() * (areaWidth - elementWidth - 2 * margin) + margin);
        const y = Math.floor(Math.random() * (areaHeight - elementHeight - 2 * margin) + margin);
        if (!positions.some(pos => areRectanglesOverlapping(x, y, pos.x, pos.y, elementWidth, elementHeight))) {
            positions.push({ x, y });
        }
    }
    return positions;
}

export function generateCorrectPositions(numRows, numCols, elementWidth, elementHeight, areaWidth, areaHeight) {
    const totalGridWidth = numCols * elementWidth;
    const totalGridHeight = numRows * elementHeight;

    const startX = (areaWidth - totalGridWidth) / 2; // Center horizontally
    const startY = (areaHeight - totalGridHeight) / 2; // Center vertically

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

export function animateTileJump(tile, duration, jumpHeight, onComplete) {
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