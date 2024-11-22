// Selecteer de elementen
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetGame');
const gameResult = document.getElementById('gameResult');

// Initiële spelvariabelen
let currentPlayer = 'X'; // Spel begint met 'X'
let boardState = Array(9).fill(null); // Houdt bij welke cellen zijn ingevuld
let isGameOver = false;

// Eventlisteners toevoegen aan elke cel
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index), { once: true });
});

// Handle click op een cel
function handleCellClick(cell, index) {
    if (isGameOver) return;

    // Vul de cel met de huidige speler en update de bordstatus
    cell.textContent = currentPlayer;
    boardState[index] = currentPlayer;

    // Controleer op winst of gelijkspel
    if (checkWin()) {
        gameResult.textContent = `Speler ${currentPlayer} wint!`;
        isGameOver = true;
        return;
    }

    if (boardState.every(cell => cell !== null)) {
        gameResult.textContent = "Gelijkspel!";
        isGameOver = true;
        return;
    }

    // Wissel van speler
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Controleer winnende combinaties
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rijen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolommen
        [0, 4, 8], [2, 4, 6]            // Diagonalen
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => boardState[index] === currentPlayer);
    });
}

// Reset het spel
resetButton.addEventListener('click', resetGame);

function resetGame() {
    // Reset spelvariabelen
    boardState.fill(null);
    currentPlayer = 'X';
    isGameOver = false;

    // Leeg alle cellen en voeg eventlisteners opnieuw toe
    cells.forEach(cell => {
        cell.textContent = '';
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', (e) => handleCellClick(e.target, [...cells].indexOf(e.target)), { once: true });
    });

    // Wis de result-melding
    gameResult.textContent = '';
}
