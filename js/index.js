// src index.js

import { AUDIO } from './game-constants.js';

const params = new URLSearchParams(window.location.search);
let currentLevel = parseInt(params.get('currentLevel'), 10) || 1;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 960;
canvas.height = 640;

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

class Button {
    constructor({ x, y, text, level, srcImage, onClick, context }) {
        this.x = x;
        this.y = y;
        this.width = 205;
        this.height = 125;
        this.text = text;
        this.level = level;
        this.srcImage = srcImage;
        this.onClick = onClick;
        this.context = context ;

        this.disabled = true; // Disable button initially if state is 'hidden'
    }

    updateState(currentLevel) {
        if (currentLevel === this.level) {
            this.state = 'current';
            this.disabled = false;
        } else if (currentLevel > this.level) {
            this.state = 'completed';
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
        this.context.drawImage(this.srcImage, this.x, this.y, this.width, this.height);
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

        // Draw text for completed levels
        this.context.fillStyle = 'white';
        this.context.font = `bold 25px Tahoma`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'top';
        this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height + 5);
        // Draw Text border
        this.context.lineWidth = 1;
        this.context.strokeStyle = "black";
        this.context.strokeText(this.text, this.x + this.width / 2, this.y + this.height + 5)
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
        if (!this.disabled && this.containsPoint(mouseX, mouseY) && this.onClick) {
            this.onClick();
        }
    }
}

function setupButtons() {
    const kelpForestBtn = new Button({
        x: canvas.width  - 725,
        y: canvas.height - 615,
        text: 'Kelp Forest',
        level: 1,
        srcImage: kelpForestImage,
        onClick: () => startGame(kelpForestImage.src),
        context: ctx,
        state: 'hidden',
    });
    const shipwrecktBtn = new Button({
        x: canvas.width  - 428,
        y: canvas.height - 570,
        text: 'Shipwreck',
        level: 2,
        srcImage: shipwreckImage,
        onClick: () => startGame(shipwreckImage.src),
        context: ctx,
        state: 'hidden',
    });
    const jellyfishBtn = new Button({
        x: canvas.width  - 780,
        y: canvas.height - 400,
        text: 'Jellyfish Flats',
        level: 3,
        srcImage: jellyfishImage,
        onClick: () => startGame(jellyfishImage.src),
        context: ctx,
        state: 'hidden',
    });
    const coralReefBtn = new Button({
        x: canvas.width  - 345,
        y: canvas.height - 385,
        text: 'Coral Reef',
        level: 4,
        srcImage: coralReefImage,
        onClick: () => startGame(coralReefImage.src),
        context: ctx,
        state: 'hidden',
    });
    const dolphinLagoonBtn = new Button({
        x: canvas.width  - 600,
        y: canvas.height - 200,
        text: 'Dolphin Lagoon',
        level: 5,
        srcImage: dolphinLagoonImage,
        onClick: () => startGame(dolphinLagoonImage.src),
        context: ctx,
        state: 'hidden',
    });

    return { kelpForestBtn, shipwrecktBtn, jellyfishBtn, coralReefBtn, dolphinLagoonBtn };
}

function setupEventListeners(buttons) {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        buttons.kelpForestBtn.handleClick(mouseX, mouseY);
        buttons.shipwrecktBtn.handleClick(mouseX, mouseY);
        buttons.jellyfishBtn.handleClick(mouseX, mouseY);
        buttons.coralReefBtn.handleClick(mouseX, mouseY);
        buttons.dolphinLagoonBtn.handleClick(mouseX, mouseY);

    });
}

function animate(buttons) {
    requestAnimationFrame(() => animate(buttons));
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    buttons.kelpForestBtn.draw();
    buttons.shipwrecktBtn.draw();
    buttons.jellyfishBtn.draw();
    buttons.coralReefBtn.draw();
    buttons.dolphinLagoonBtn.draw();


    switch (currentLevel) {
        case 1:
            AUDIO.welcome.play()
            setTimeout(() => {
                AUDIO.kelpForest.play();
            }, 12000);
            break;
        case 2:
            AUDIO.shipwreck.play();
            break;
        case 3:
            AUDIO.jellyfish.play();
            break;
        case 4:
            AUDIO.coral.play();
            break;
        case 5:
            AUDIO.lastSpot.play()
            break;
    }

}

function startPuzzle() {
    const buttons = setupButtons();
    setupEventListeners(buttons);
    console.log("Animating")
    animate(buttons);
}

startPuzzle();

function startGame(imageSrc, imageSrcWidth = 930, imageSrcHeight = 530) {
    const gameInfo = `?imageSrc=${encodeURIComponent(imageSrc)}&imageSrcWidth=${imageSrcWidth}&imageSrcHeight=${imageSrcHeight}&currentLevel=${currentLevel}`;
    window.location.href = `game.html${gameInfo}`;
}
