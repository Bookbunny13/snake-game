const speedRange = document.getElementById('speedRange');
const speedDisplay = document.getElementById('speedDisplay');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let speed = parseInt(speedRange.value); // Speed in milliseconds
let autoControl = true; // Enable auto control for cheat code

function gameLoop() {
    if (autoControl) {
        autoControlSnake();
    }
    update();
    draw();
    setTimeout(gameLoop, speed);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
    }
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lime';
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 10);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: 15, y: 15 };
    score = 0;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = direction.y === -1;
    const goingDown = direction.y === 1;
    const goingRight = direction.x === 1;
    const goingLeft = direction.x === -1;

    if (keyPressed === LEFT && !goingRight) {
        direction = { x: -1, y: 0 };
    }
    if (keyPressed === UP && !goingDown) {
        direction = { x: 0, y: -1 };
    }
    if (keyPressed === RIGHT && !goingLeft) {
        direction = { x: 1, y: 0 };
    }
    if (keyPressed === DOWN && !goingUp) {
        direction = { x: 0, y: 1 };
    }
}

function autoControlSnake() {
    const head = snake[0];
    const possibleMoves = [
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 }   // Right
    ];

    const safeMoves = possibleMoves.filter(move => {
        const nextX = head.x + move.x;
        const nextY = head.y + move.y;

        // Check wall collision
        if (nextX < 0 || nextX >= tileCount || nextY < 0 || nextY >= tileCount) {
            return false;
        }

        // Check self-collision
        return !snake.some(segment => segment.x === nextX && segment.y === nextY);
    });

    // Prioritize moving towards the food if safe
    if (safeMoves.length > 0) {
        // Sort safe moves by distance to food (Manhattan distance)
        safeMoves.sort((a, b) => {
            const distA = Math.abs(food.x - (head.x + a.x)) + Math.abs(food.y - (head.y + a.y));
            const distB = Math.abs(food.x - (head.x + b.x)) + Math.abs(food.y - (head.y + b.y));
            return distA - distB;
        });

        direction = safeMoves[0]; // Choose the best move
    } else {
        // If no safe moves are available (extremely rare), stop the snake
        direction = { x: 0, y: 0 };
    }
}

document.addEventListener('keydown', changeDirection);
speedRange.addEventListener('input', () => {
    speed = parseInt(speedRange.value);
    speedDisplay.textContent = speed;
});
gameLoop();