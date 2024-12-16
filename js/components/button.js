//src = button.js

export class Button {
    constructor({ x, y, width, height, text, onClick, context}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.onClick = onClick;
        this.context = context // canvas context needs to be passed into this class to draw
    }

    draw() {
        // Draw button background
        this.context.fillStyle = 'grey'; // Button color
       this.context.fillRect(this.x, this.y, this.width, this.height);

        // Draw button text
       this.context.fillStyle = 'white'; // Text color
       this.context.font = `${this.height * 0.7}px Tahoma`; // Font size relative to height
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
        if (this.containsPoint(mouseX, mouseY) && this.onClick) {
            this.onClick();
        }
    }
}
