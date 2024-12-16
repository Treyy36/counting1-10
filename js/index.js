// src index.js

function startGame(imageSrc, rows, cols) {
    const queryString = `?imageSrc=${encodeURIComponent(imageSrc)}&rows=${rows}&cols=${cols}`;
    window.location.href = `game.html${queryString}`;
}

window.startGame = startGame;