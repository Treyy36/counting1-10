// src classes.js
class ImageTile {
    constructor({ position, velocity, value, context, rows, cols, image, imageWidth, imageHeight, enabled}) {
        this.position = position;
        this.velocity = velocity;
        this.value = value;
        this.context = context;
        this.rows = rows;
        this.cols = cols;
        this.image = image;
        this.enabled = enabled;

        this.numTiles = rows * cols;
        this.tileHeight = imageHeight / rows;
        this.tileWidth = imageWidth / cols;
        this.animationSpeed = 0.05;

        this.width = this.tileHeight / 2;
        this.height = this.tileWidth / 2;
        this.isRevealed = false;
        this.resetTile = false;
        this.fontColor = 'white';
        this.borderColor = 'black';
        this.drawFinalBorder = false;
        this.animationJump = 0;
        this.order = this.createOrderArray(this.numTiles);
    }

    createOrderArray(numTiles) {
        const order = []
        for (let i = 0; i < numTiles; i++) {
            order[i] = i+1;
        }
        return order;
    }

    draw() {
        const sx = (this.value-1) % this.cols * this.tileWidth //Source X in full image
        const sy = Math.floor((this.value - 1) / this.cols) * this.tileHeight;
        // console.log(`Tile ${this.value} | sx: ${sx}, sy: ${sy} | posX: ${this.position.x}, posY: ${this.position.y}`);

        this.context.drawImage(
            this.image, sx, sy, this.tileWidth, this.tileHeight,   // Cropped positions and dimensions from src
            this.position.x, this.position.y, this.width, this.height // Displayed positions and dimension from cropp  on canvas
        );

        if (!this.isRevealed) {
            this.context.fillStyle = 'rgba(93, 185, 198, 0.8)';
            this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
            // Draw border
            this.context.lineWidth = 2;
            this.context.strokeStyle = "#black";
            this.context.strokeRect(this.position.x, this.position.y, this.width, this.height)
        }

        if (this.drawFinalBorder) {
            this.context.lineWidth = 4;
            this.context.strokeStyle = customYellow;
            this.context.strokeRect(15, 42.5, 930, 530)
        }

        // Draw Text
        const fontSize = Math.min(this.width, this.height) * 0.6; // 40% of the smaller tile dimension
        this.context.fillStyle = this.fontColor; // Text color
        this.context.font = `bold ${fontSize}px Tahoma`; // Set dynamic font size
        this.context.textAlign = 'center'; // Center text horizontally
        this.context.textBaseline = 'middle'; // Center text vertically
        this.context.fillText(
            this.value, // The value to display
            this.position.x + this.width / 2, // X: center of the tile
            this.position.y + this.height / 2 - this.animationJump +3 // Y: center of the tile
        );
        // Draw Text Outline
        this.context.lineWidth = 2;
        this.context.strokeStyle = this.borderColor;
        this.context.strokeText(
            this.value, 
            this.position.x + this.width / 2, 
            this.position.y + this.height / 2 - this.animationJump +3 // Y: center of the tile
        )
    }

    moveToTarget(targetX, targetY, speed) {
        this.position.x += (targetX - this.position.x) * speed;
        this.position.y += (targetY - this.position.y) * speed;
    }

    resizeToTarget(targetWidth, targetHeight, speed) {
        this.width += (targetWidth - this.width) * speed;
        this.height += (targetHeight - this.height) * speed;
    }

    update() {
        this.draw()
        if (!this.isRevealed) {
            this.draw();
        } else {
            this.draw()
            const targetPosition = correctPositions[this.value - 1];
            this.moveToTarget(targetPosition.x, targetPosition.y, this.animationSpeed);
            this.resizeToTarget(this.tileWidth, this.tileHeight, this.animationSpeed);
        }

        if (this.resetTile) {
            this.draw()
            const targetPosition = randomPositions[this.value - 1];
            this.moveToTarget(targetPosition.x, targetPosition.y, this.animationSpeed);
        }
    }

    checkOrder(value) {
        // console.log(`Tile value: ${this.value} and the current order is: ${this.order[orderCnt]}`)
        if (value === this.order[orderCnt]) {
            AUDIO.correct.currentTime = 0;
            AUDIO.correct.play();
            this.isRevealed = true;
            orderCnt++;

            if (value === this.numTiles) {
                orderCnt = 0;

                setTimeout(() => {
                AUDIO.levelComplete.currentTime = 0;
                AUDIO.levelComplete.play();
                }, 2000);

                setTimeout(() => {
                    winSequence();
                }, 2500);
            }

        } else {
            AUDIO.incorrect.currentTime = 0;
            AUDIO.incorrect.play();
            this.fontColor = 'Red';
            setTimeout(() => {
                this.fontColor = 'White';
            }, 1000); 
        }
    }
}
class PuzzleLocation {
    constructor({ x, y, text, level, image, onClick, context }) {
        this.x = x;
        this.y = y;
        this.width = 205;
        this.height = 125;
        this.text = text;
        this.level = level;
        this.image = image;
        this.onClick = onClick;
        this.context = context;

        this.currentLevel = 0;
        this.enabled = false; 
    }

    changeCurrentLevel(level){
        this.currentLevel = level;
    }
    updateState(currentLevel) {
        if (currentLevel === this.level) {
            this.state = 'current';
            this.enabled = true;
        } else if (currentLevel+1 > this.level) {
            this.state = 'completed';
            this.enabled = false
        } else {
            this.state = 'hidden';
        }
    }

    draw() {
        this.updateState(currentLevel);
        this.context.save();
        if (this.state === 'hidden') {
            this.context.filter = 'grayscale(100%)';
        }
        // Draw the level image
        this.context.beginPath();
        this.context.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.min(this.width, this.height) / 2,
            0,
            Math.PI * 2
        );
        this.context.closePath();
        this.context.clip();
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.context.restore();

        // Draw border
        this.context.beginPath();
        this.context.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.min(this.width, this.height) / 2,
            0,
            Math.PI * 2
        );

        // Border color based on state
        if (this.state === 'hidden') {
            this.context.strokeStyle = 'grey'; 
        } else if (this.state === 'current') {
            this.context.strokeStyle = '#00a860'; 
            this.context.stroke
        } else if (this.state === 'completed') {
            this.context.strokeStyle = 'white'; 
        }

        this.context.lineWidth = this.state === 'current' ? 6 : 2; // Thicker border for current state
        this.context.stroke();
        // // Draw Text Decoration
        // this.context.fillStyle = customYellow;
        // this.context.font = `35px ${defaultFont}`;
        // this.context.textAlign = 'center';
        // this.context.textBaseline = 'top';
        // this.context.fillText(this.text, this.x + this.width / 2 + 3, this.y + this.height + 5);
        // Draw text for completed levels
        this.context.fillStyle = customOrange;
        this.context.font = `35px ${defaultFont}`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'top';
        this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height + 5);
        // Draw text outline
        this.context.lineWidth = 0.5; // Outline thickness
        this.context.strokeStyle = customYellow; // Outline color
        this.context.strokeText(this.text, this.x + this.width / 2, this.y + this.height + 5);
    }

    containsPoint(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }

    handleClick(mouseX, mouseY) {
        if (this.enabled && this.containsPoint(mouseX, mouseY) && this.onClick) {
            this.onClick();
        }
    }

    startGame(imageSrcWidth = 930, imageSrcHeight = 530){
        const gameInfo = `?imageSrc=${encodeURIComponent(this.imageSrc)}&imageSrcWidth=${imageSrcWidth}&imageSrcHeight=${imageSrcHeight}&currentLevel=${currentLevel}`;
        window.location.href = `game.html${gameInfo}`;
    }
}
class Button {
    constructor({ x, y, width, height, text, secondaryText, enabled, onClick, context}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.secondaryText = secondaryText;
        this.enabled = enabled;
        this.onClick = onClick;
        this.context = context // canvas context needs to be passed into this class to draw
    }

    draw() {
        // Rounded corners setup
        const radius = 10; // Adjust for desired roundness
        // Create gradient for button when disabled
        if (!this.enabled) {
            const gradient = this.context.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
            gradient.addColorStop(0, '#f0f0f0'); // A slightly darker shade of white
            gradient.addColorStop(1, '#d3d3d3'); // A slightly darker shade of light grey
            this.context.fillStyle = gradient;
        } else {
            this.context.fillStyle = customOrange;
        }
        this.context.beginPath();
        this.context.moveTo(this.x + radius, this.y);
        this.context.lineTo(this.x + this.width - radius, this.y);
        this.context.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + radius);
        this.context.lineTo(this.x + this.width, this.y + this.height - radius);
        this.context.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height);
        this.context.lineTo(this.x + radius, this.y + this.height);
        this.context.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - radius);
        this.context.lineTo(this.x, this.y + radius);
        this.context.quadraticCurveTo(this.x, this.y, this.x + radius, this.y);
        this.context.closePath();
        this.context.fill();
        // Draw border
        this.context.lineWidth = 2;
        this.context.strokeStyle = "black";
        this.context.stroke();
        // Draw button text
        this.context.fillStyle = 'white';
        this.context.font = `bold 50px ${defaultFont}`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        // Draw button secondary text
        this.context.fillStyle = 'white';
        this.context.font = `bold 17px ${defaultFont}`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(this.secondaryText, this.x + this.width / 2, this.y + this.height / 2 + 42);
    }
    containsPoint(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }

    handleClick(mouseX, mouseY) {
        if (this.enabled && this.containsPoint(mouseX, mouseY) && this.onClick) {
            this.onClick();
        }
    }
}
class Title {
    constructor({ x, y, width, height, text, enabled, onClick, context}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.enabled = true;
        this.context = context // canvas context needs to be passed into this class to draw
    }

    draw() {
        if (this.enabled) {
            this.context.fillStyle = customOrange;
            this.context.font = `Bold 45px ${defaultFont}`;
            this.context.textAlign = 'center';
            this.context.textBaseline = 'top';
            this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height + 5);
            // Draw text outline
            this.context.lineWidth = 1; // Outline thickness
            this.context.strokeStyle = customYellow; // Outline color
            this.context.strokeText(this.text, this.x + this.width / 2,this.y + this.height + 5);
        }
    }
}
