const board = document.querySelectorAll('[data-cell]');
        const restartButton = document.getElementById('restartButton');
        const modeButton = document.getElementById('modeButton');
        const winnerMessage = document.getElementById('winner-message');
        const gameOverElement = document.getElementById('game-over');

        let circleTurn = false;
        let vsComputer = false;
        const X_CLASS = 'X';
        const O_CLASS = 'O';
        const WINNING_COMBINATIONS = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        startGame();

        modeButton.addEventListener('click', () => {
            vsComputer = !vsComputer;
            modeButton.textContent = vsComputer ? 'Switch to Player vs Player' : 'Switch to Player vs Computer';
            startGame();
        });

        restartButton.addEventListener('click', startGame);

        function startGame() {
            circleTurn = false;
            board.forEach(cell => {
                cell.classList.remove(X_CLASS);
                cell.classList.remove(O_CLASS);
                cell.textContent = ''; 
                cell.removeEventListener('click', handleClick);
                cell.addEventListener('click', handleClick, { once: true });
            });
            gameOverElement.classList.add('hide');
            winnerMessage.textContent = '';
        }

        function handleClick(e) {
            const cell = e.target;
            const currentClass = circleTurn ? O_CLASS : X_CLASS;
            placeMark(cell, currentClass);

            if (checkWin(currentClass)) {
                endGame(false);
            } else if (isDraw()) {
                endGame(true);
            } else {
                swapTurns();
                if (vsComputer && circleTurn) {
                    setTimeout(computerMove, 500);
                }
            }
        }

        function placeMark(cell, currentClass) {
            cell.textContent = currentClass;
            cell.classList.add(currentClass);
        }

        function swapTurns() {
            circleTurn = !circleTurn;
        }

        function checkWin(currentClass) {
            return WINNING_COMBINATIONS.some(combination => {
                return combination.every(index => {
                    return board[index].classList.contains(currentClass);
                });
            });
        }

        function isDraw() {
            return [...board].every(cell => {
                return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
            });
        }

        function endGame(draw) {
            if (draw) {
                winnerMessage.textContent = 'Draw!';
            } else {
                winnerMessage.textContent = `${circleTurn ? "O's" : "X's"} Wins!`;
            }
            gameOverElement.classList.remove('hide');
        }

        function computerMove() {
            const availableCells = [...board].filter(cell => {
                return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
            });

            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const cell = availableCells[randomIndex];

            placeMark(cell, O_CLASS);

            if (checkWin(O_CLASS)) {
                endGame(false);
            } else if (isDraw()) {
                endGame(true);
            } else {
                swapTurns();
            }
        }