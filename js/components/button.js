//src = button.js

import { puzzleWin } from "../game.js";

export class Button {
    constructor({ x, y, width, height, text, isenabled, onClick, context}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.isenabled = isenabled;
        this.onClick = onClick;
        this.context = context // canvas context needs to be passed into this class to draw
    }

    draw() {
        if (puzzleWin) this.isenabled = true;
        // Rounded corners setup
        const radius = 10; // Adjust for desired roundness
    
        // Shadow properties
        this.context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.context.shadowOffsetX = 3;
        this.context.shadowOffsetY = 3;
        this.context.shadowBlur = 5;
    
        // Create gradient
        const gradient = this.context.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        if (!this.isenabled) {
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, 'lightgrey');
        } else {
            gradient.addColorStop(0, 'orange');
            gradient.addColorStop(1, 'darkorange');
        }
        // Draw rounded rectangle with gradient
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
    
        // Fill with gradient
        this.context.fillStyle = gradient;
        this.context.fill();
    
        // Reset shadow for border
        this.context.shadowColor = 'transparent';
    
        // Draw border
        this.context.lineWidth = 2;
        this.context.strokeStyle = "black";
        this.context.stroke();
    
        // Draw button text
        this.context.fillStyle = 'white';
        this.context.font = `${this.height * 0.7}px Tahoma`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
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
        if (this.isenabled && this.containsPoint(mouseX, mouseY) && this.onClick) {
            this.onClick();
        }
    }
}
