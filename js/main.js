const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let score = 0;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 20, y: 0 };
let food = generateFoodPosition();
let isGameRunning = true;

// Score-elementen ophalen
const scoreDisplay = document.getElementById('score');
const scoresList = document.getElementById('scoresList');
const saveScoreButton = document.createElement('button');
saveScoreButton.innerText = 'Score opslaan';
saveScoreButton.style.display = 'none';
document.body.appendChild(saveScoreButton);

document.addEventListener('keydown', handleKeyPress);
saveScoreButton.addEventListener('click', saveScore);

function gameLoop() {
    if (!isGameRunning) return;

    if (isGameOver()) {
        isGameRunning = false;
        alert(`Game Over! Je score: ${score}. Druk op spatie om opnieuw te beginnen.`);
        saveScoreButton.style.display = 'block'; // Toon de score opslaan knop
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
    ctx.fillRect(food.x, food.y, 20, 20);
}

function generateFoodPosition() {
    return {
        x: Math.floor(Math.random() * canvas.width / 20) * 20,
        y: Math.floor(Math.random() * canvas.height / 20) * 20
    };
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.innerText = score;
        food = generateFoodPosition();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(part => ctx.fillRect(part.x, part.y, 20, 20));
}

function handleKeyPress(event) {
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
    } else if (keyPressed === ' ') {
        resetGame();
    }
}

function isGameOver() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height;
}

function resetGame() {
    score = 0;
    snake = [{ x: 200, y: 200 }];
    direction = { x: 20, y: 0 };
    food = generateFoodPosition();
    isGameRunning = true;
    scoreDisplay.innerText = score;
    saveScoreButton.style.display = 'none';
    gameLoop();
}

// Opslaan van de score in localStorage met naam
function saveScore() {
    const playerName = prompt("Voer je naam in:");
    if (!playerName) return;

    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ name: playerName, score: score });
    localStorage.setItem('scores', JSON.stringify(scores));

    displayScores();
    saveScoreButton.style.display = 'none';
}

// Scorebord weergeven
function displayScores() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scoresList.innerHTML = scores
        .map(entry => `<li>${entry.name}: ${entry.score}</li>`)
        .join('');
}

// Haal de 'Verwijder alle scores' knop op
const clearScoresButton = document.getElementById('clearScoresButton');

// Event listener voor de 'Verwijder alle scores' knop
clearScoresButton.addEventListener('click', clearScores);

// Functie om alle scores te wissen
function clearScores() {
    if (confirm("Weet je zeker dat je alle scores wilt verwijderen?")) {
        localStorage.removeItem('scores');
        displayScores(); // Werk de scorelijst bij om leeg te zijn
    }
}


// Scorebord weergeven bij eerste laad
displayScores();
gameLoop();
