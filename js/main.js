const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let score = 0;
let snake = [{ x: 200, y: 200 }];  // Startpositie van de slang, gecentreerd in het raster
let direction = { x: 20, y: 0 };    // Start richting naar rechts
let food = generateFoodPosition();

// Luister naar toetsindrukken voor besturing van de slang
document.addEventListener('keydown', changeDirection);

function gameLoop() {
    if (isGameOver()) {
        alert(`Game Over! Je score: ${score}`);
        resetGame();
        return;
    }

    setTimeout(() => {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        gameLoop();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);  // Voedselgrootte op hetzelfde grid
}

function generateFoodPosition() {
    // Genereer voedselpositie uitgelijnd op een raster van 20x20
    return {
        x: Math.floor(Math.random() * canvas.width / 20) * 20,
        y: Math.floor(Math.random() * canvas.height / 20) * 20
    };
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Controleer of de slang het voedsel heeft opgepakt
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        food = generateFoodPosition();  // Genereer nieuw voedsel
    } else {
        snake.pop();  // Verwijder het laatste deel van de slang
    }

    // Voeg de nieuwe kop toe aan het begin van de slang
    snake.unshift(head);
}

function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(part => ctx.fillRect(part.x, part.y, 20, 20));  // Slangdelen uitgelijnd op het grid
}

function changeDirection(event) {
    const keyPressed = event.key.toLowerCase();
    const goingUp = direction.y === -20;
    const goingDown = direction.y === 20;
    const goingRight = direction.x === 20;
    const goingLeft = direction.x === -20;

    if (keyPressed === 'w' && !goingDown) {
        direction = { x: 0, y: -20 };
    } else if (keyPressed === 's' && !goingUp) {
        direction = { x: 0, y: 20 };
    } else if (keyPressed === 'a' && !goingRight) {
        direction = { x: -20, y: 0 };
    } else if (keyPressed === 'd' && !goingLeft) {
        direction = { x: 20, y: 0 };
    }
}

function isGameOver() {
    const head = snake[0];

    // Controleer of de slang zichzelf raakt
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }

    // Controleer of de slang de randen van het canvas raakt
    return head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height;
}

function resetGame() {
    score = 0;
    snake = [{ x: 200, y: 200 }];
    direction = { x: 20, y: 0 };
    food = generateFoodPosition();
    document.getElementById('score').innerText = score;
}

gameLoop();
