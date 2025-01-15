// src constants.js

//Audio
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
// Images
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

//Game and Canvas constants
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
const confettiPieces = [];
let lastLevelCompleted = false;

let currentLevel = 0;
let selectingLevel = true;
let orderCnt = 0;
const order = []
for (let i = 0; i < 10; i++) {
    order[i] = i+1;
}

// Class constants
const countingText = new Title({
    x: canvas.width/2 - 250/2,
    y: 275,
    width: 250, 
    height: -278,
    text: 'Click the numbers from 1 to 10!',
    context: ctx,
})

const continueButton = new Button({
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
const exitButton = new Button({
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
const restartButton = new Button({
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
// Event listener to handle click for buttons
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    continueButton.handleClick(mouseX, mouseY);
    restartButton.handleClick(mouseX, mouseY);
    exitButton.handleClick(mouseX, mouseY);
});
