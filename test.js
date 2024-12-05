    //Setup canvas
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');
    canvas.width = 960;
    canvas.height = 640;

    const imageSize = 75;
    const imageUrlsHidden = [
        "img/Count10_Puzzle_Pieces_Blue_1.jpg",
        "img/Count10_Puzzle_Pieces_Blue_2.jpg",
        "img/Count10_Puzzle_Pieces_Blue_3.jpg",
        "img/Count10_Puzzle_Pieces_Blue_4.jpg",
        "img/Count10_Puzzle_Pieces_Blue_5.jpg",
        "img/Count10_Puzzle_Pieces_Blue_6.jpg",
        "img/Count10_Puzzle_Pieces_Blue_7.jpg",
        "img/Count10_Puzzle_Pieces_Blue_8.jpg",
        "img/Count10_Puzzle_Pieces_Blue_9.jpg",
        "img/Count10_Puzzle_Pieces_Blue_10.jpg"
    ];
    const imageUrlsColored = [
        "img/Count10_Puzzle_Pieces_1.jpg",
        "img/Count10_Puzzle_Pieces_2.jpg",
        "img/Count10_Puzzle_Pieces_3.jpg",
        "img/Count10_Puzzle_Pieces_4.jpg",
        "img/Count10_Puzzle_Pieces_5.jpg",
        "img/Count10_Puzzle_Pieces_6.jpg",
        "img/Count10_Puzzle_Pieces_7.jpg",
        "img/Count10_Puzzle_Pieces_8.jpg",
        "img/Count10_Puzzle_Pieces_9.jpg",
        "img/Count10_Puzzle_Pieces_10.jpg"
    ]

    let orderCnt = 0;
    const order = [1,2,3,4,5,6,7,8,9,10];

    class ImageTileHidden{
        constructor({src, position, velocity, value}) {
            const  image = new Image();
            image.src = src;
            this.velocity = velocity;
            image.onload = () => {
                this.image = image;
                this.width = imageSize
                this.height = imageSize;
                this.position = position
                this.value = value;
            }
            this.onClick();   
            this.isRevealed = false;
            this.resetTile = false;
        }

        draw() {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
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
            if (this.image) {
                if (!this.isRevealed) {
                    this.draw();
                    this.position.x += this.velocity.x;
                    this.position.y += this.velocity.y;
                } 
                if (this.isRevealed) {
                    this.draw();
                    const targetPosition = correctPositions[this.value-1];
                    this.moveToTarget(targetPosition.x, targetPosition.y, 0.05); // Adjust speed for smoothness
                    this.resizeToTarget(imageSize + 30, imageSize + 30, 0.05); // Adjust speed for scaling
                }   
                if (this.resetTile) {
                    this.draw();
                    const targetPosition2 = randomPositions[this.value-1];
                    // this.resizeToTarget(imageSize, imageSize, 0.05); // Adjust speed for scaling
                    this.moveToTarget(targetPosition2.x, targetPosition2.y, 0.05); // Adjust speed for smoothness
                }
            }
        }

        containsPoint(x, y) {
            // Check if a point is inside this image tile
            return (
                x >= this.position.x &&
                x <= this.position.x + this.width &&
                y >= this.position.y &&
                y <= this.position.y + this.height
            );
        }

        onClick() {
            this.clickHandler = (event) => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
        
                if (this.containsPoint(mouseX, mouseY)) {
                    this.checkOrder(this.value);
                }
            };
        
            canvas.addEventListener('click', this.clickHandler);
        }
        
        hideImage() {
            const newSrc = imageUrlsHidden[this.value-1];
            this.image = new Image();
            this.image.src = newSrc;
            this.isRevealed = false;
            // canvas.addEventListener('click', this.clickHandler);
            
        }
        revealImage() {
            const newSrc = imageUrlsColored[this.value - 1];
            this.image = new Image();
            this.image.src = newSrc;
            this.isRevealed = true;
            canvas.removeEventListener('click', this.clickHandler);
        }
        
        checkOrder(value) {
            if (value == order[orderCnt]) {
                console.log(`Image with value ${this.value} clicked! - Correct!`)
                this.revealImage();    
                orderCnt++;
                if (value == 10) {
                    orderCnt = 0;
                    setTimeout(() => {
                        alert("You Win!")
                        resetPuzzle();
                    }, 3500); // 3.5s delay for the animation to finish
                }
            } else {
                console.log(`Image with value ${this.value} clicked! - Incorrect.`)
                orderCnt = 0;
                resetPuzzle();
                

            }
        }
    }

    function resetPuzzle() {
        console.log("Resetting Puzzle")
        // Remove old event listeners before resetting the array
        for(let i = 0; i < hiddenImages.length; i++) {
            canvas.removeEventListener('click', hiddenImages[i].clickHandler); 
        }
        //Reset array
        hiddenImages.length = 0;
        initializeHiddenImages(randomPositions);
    }
    function initializeHiddenImages(positions) {
        for (let i = 0; i < positions.length; i++) {
            hiddenImages.push(new ImageTileHidden({
                src: imageUrlsHidden[i],
                position: {x: positions[i].x, y: positions[i].y},
                velocity: {x: 0, y: 0},
                value: i+1
            }));
        }
    }

    function generateRandomPositions(numElements, elementWidth, elementHeight, areaWidth, areaHeight) {
        const positions = [];

        while (positions.length < numElements) {
            // Generate a random position
            const x = Math.floor(Math.random() * (areaWidth - elementWidth));
            const y = Math.floor(Math.random() * (areaHeight - elementHeight));
            
            // Check if it overlaps with any existing position
            let overlap = false;
            for (const pos of positions) {
                if (areRectanglesOverlapping(x, y, pos.x, pos.y, elementWidth, elementHeight)) {
                    overlap = true;
                    break;
                }
            }
            
            // If no overlap, add the position to the array
            if (!overlap) {
                positions.push({ x, y });
            }
        }

        return positions;
    }

    function generateCorrectPositions(numRows, numCols, elementLength, areaWidth, areaHeight) {
        const positions = [];
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const x = Math.round((areaWidth/2 - elementLength*5/2) + (elementLength * col)); // Start x at 150 and increment by elementLength
                const y = Math.round((areaHeight/2 - elementLength ) + (elementLength * row)); // Start y at 150 and increment by elementLength for each row
                positions.push({ x, y });
            }
        }
        return positions;
    }

    // Function to check if two rectangles overlap
    function areRectanglesOverlapping(x1, y1, x2, y2, width, height) {
        return (
            x1 < x2 + width &&
            x1 + width > x2 &&
            y1 < y2 + height &&
            y1 + height > y2
        );
    }


    const hiddenImages = [];
    const randomPositions = generateRandomPositions(10, imageSize, imageSize, canvas.width-10, canvas.height-10)
    const correctPositions = generateCorrectPositions(2, 5, imageSize+30, canvas.width, canvas.height);
    initializeHiddenImages(randomPositions);

    animate();
    function animate() {
        requestAnimationFrame(animate);
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);

        hiddenImages.forEach((image) => {
            image.update()
        })
    }