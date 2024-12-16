// src index.js

function startGame(imageSrc, imageSrcWidth, imageSrcHeight) {
    const queryString = `?imageSrc=${encodeURIComponent(imageSrc)}&imageSrcWidth=${imageSrcWidth}&imageSrcHeight=${imageSrcHeight}`;
    window.location.href = `game.html${queryString}`;
}

window.startGame = startGame;