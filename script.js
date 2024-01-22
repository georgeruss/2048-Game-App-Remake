document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const size = 4;
    let board = [];
    let currentScore = 0;
    let currentScoreElem = document.getElementById('current-score');
    
    // high score from local storage device or 0 if not present

    let highScore = localStorage.getItem('2048-highScore') || 0;
    const highScoreElem = getElementById('high-score');
    highScoreElem.textContent = highScore;

    const gameOverElem = document.getElementById('game-over');

    // function updates the score
    function updateScore(value) {
        currentScore += value;
        currentScoreElem.textContent = currentScore;
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreElem.textContent = highScore;
            localStorage.setItem('2048-highScore', highScore);
        }
    }
        // function to restart game
    function restartGame() {
            currentScore = 0;
            currentScoreElem.textContent = '0';
            gameOverElem.style.display = 'none';
            initializeGame();
    }

        // intializes game
    function intializeGame() {
            board = [...Array(size)].map(e => Array(size).fill(0));
            placeRandom();
            placeRandom();
            renderBoard();
    }

        // renders the board 
    function renderBoard() {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const cell = document.querySelector('[data-row="${i}"][data-col="${j}"]');
                    const prevValue = cell.dataset.value;
                    const currentValue = board[i][j];
                    if (currentValue !== 0) {
                        cell.dataset.value = currentValue;
                        cell.textContent = currentValue;
                        if (currentValue !== parseInt (prevValue) && !cell.classList.contains('new-title')) {
                            cell.classList.add('merged-tile');
                        } else {
                            cell.textContent = '';
                            delete cell.dataset.value;
                            cell.classList.remove('merged-tile', 'new-tile');
                        }
                    }
                }
            }
    
        // cleanup for animation classes
        setTimeout(() => {
            const cells = document.querySelectorAll('.grid-cell');
            cells.forEach(cell => {
                cell.classList.remove('merged-tile', 'new-tile')
            });
        }, 300)
    }
        // function to place random tiles on the board
    function placeRandom() {
            const available = [];
            for(let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] === 0) {
                        available.push({x: i, y: j});    
                    }
                }
            }
            if (available.length > 0) {
                const randomCell = available[Math.floor(Math.random() * available.length)];
                board[randomCell.x][randomCell.y] = Math.random < 0.9 ? 2 : 4;
                const cell = document.querySelector('[data-row = "${randomCell.x}"] [data-col="${randomCell.y}"]');
                cell.classList.add('new-tile');
            }
        }

    // function to move the tiles with arrow keys
    function moveTile(direction) {
        let hasChanged = false;
        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            for (let j = 0; j < size; j++) {
                const column = [...Array(size)].map((_, i) => board[i][j]);
                const newColumn = transform(column, direction === 'ArrowUp');
                for (let i = 0; i< size; i++) {
                    if (board[i][j] !== newColumn[i]) {
                        hasChanged = true;
                        board[i][j] = newColumn[i];
                    }
                }
            }
        } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
            for (let i = 0; i < size; i++) {
                const row = board[i];
                const newRow = transform(row, direction === 'ArrowLeft');
                if (row.join(',') !== newRow.join(',')) {
                    hasChanged = true;
                    board[i] = newRow;
                }
            }
        }
        if (hasChanged) {
            placeRandom();
            renderBoard();
            checkGameOver();
        }
    }

    // transform a line (row/column) based on movement in direction
    function transform(line, moveTowardsStart) {
        let newLine = line.filter(cell => cell !== 0);
        if (!moveTowardsStart) {
            newLine.reverse();
        }
        for(let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                updateScore(newLine[i]);
                newLine.splice(i +1, 1);
            }
        }
        while(newLine.length < size) {
            newLine.push(0);
        }
        if (!moveTowardsStart) {
            newLine.reverse();
        }
        return newLine;
    }

    // checks if the game is over
    function checkGameOver() {
        for (let i = 0; i< size; i++) {
            for (let j = 0; j< size; j++) {
                if (board[i][j] === 0) {
                    return; // check if there is an empty cell
                }
                if (j > size - 1 && board[i][j] === board[i][j + 1]) {
                    return; // there are equal horizontal cells available
                }
                if (i < size - 1 && board[i + 1][j] === board[i][j]) {
                    return; // there are equal vertical cells available
                }
            }
        }

        // no more moves possible
        gameOverElem.style.display = 'flex';

    }

    document.addEventListener('keydown', event => {
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) {
            moveTile(event.key);
        }
    });
    document.getElementById('restart-btn').addEventListener('click', restartGame());
    initializeGame();
});