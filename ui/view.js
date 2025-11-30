import {GameStatuses} from "../GAME_STATUSES.js";

export class View {
    onstart = null;
    onplayermove = null;

    constructor(){
         document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'ArrowUp':
                    this.onplayermove?.(1, 'UP');
                    break;
                case 'ArrowDown':
                    this.onplayermove?.(1, 'DOWN');
                    break;
                case 'ArrowLeft':
                    this.onplayermove?.(1, 'LEFT');
                    break;
                case 'ArrowRight':
                    this.onplayermove?.(1, 'RIGHT');
                    break;
                case 'KeyW':
                    this.onplayermove?.(2, 'UP');
                    break;
                case 'KeyS':
                    this.onplayermove?.(2, 'DOWN');
                    break;
                case 'KeyA':
                    this.onplayermove?.(2, 'LEFT');
                    break;
                case 'KeyD':
                    this.onplayermove?.(2, 'RIGHT');
                    break;
                default:
                    return
            }
            // onplavermove()
        })
        const startButton = document.querySelector('.main-button');
        if (startButton) {
            startButton.onclick = () => {
                this.onstart?.();
            }
        }
    }

    render(dto) {
        this.#updateGameGrid(dto);
        this.#updateStats(dto);
        this.#updateGameStatus(dto);
    }

    #updateGameGrid(dto) {
        const table = document.querySelector('.table');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        for (let y = 0; y < dto.gridSize.rowsCount; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < dto.gridSize.columnsCount; x++) {
                const cell = document.createElement('td');
                cell.className = 'cell';

                if (dto.player1Position && dto.player1Position.x === x && dto.player1Position.y === y) {
                    cell.innerHTML = '<img src="img/icons/man01.svg" alt="Player 1">';
                } else if (dto.player2Position && dto.player2Position.x === x && dto.player2Position.y === y) {
                    cell.innerHTML = '<img src="img/icons/man02.svg" alt="Player 2">';
                } else if (dto.googlePosition && dto.googlePosition.x === x && dto.googlePosition.y === y) {
                    cell.innerHTML = '<img src="img/icons/googleIcon.svg" alt="Google">';
                }

                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
    }

    #updateStats(dto) {
        const catchElements = document.querySelectorAll('.result-block .result');
        if (catchElements.length >= 2) {
            catchElements[0].textContent = dto.player1CaughtCount || 0;
            catchElements[1].textContent = dto.player2CaughtCount || 0;
        }
    }

    #updateGameStatus(dto) {
        const modals = document.querySelectorAll('.modal');

        modals.forEach(modal => {
            modal.style.display = 'none';
        });

        if (dto.status === 'WIN') {
            const winModal = document.querySelector('.modal:first-child');
            if (winModal) {
                winModal.style.display = 'block';
                const modalResults = winModal.querySelectorAll('.result-block .result');
                if (modalResults.length >= 2) {
                    modalResults[0].textContent = dto.player1CaughtCount || 0;
                    modalResults[1].textContent = dto.player2CaughtCount || 0;
                }

                const playAgainButton = winModal.querySelector('.button');
                if (playAgainButton) {
                    playAgainButton.onclick = () => {
                        location.reload();
                    };
                }
            }
        } else if (dto.status === 'LOSE') {
            const loseModal = document.querySelector('.modal:last-child');
            if (loseModal) {
                loseModal.style.display = 'block';
                const modalResults = loseModal.querySelectorAll('.result-block .result');
                if (modalResults.length >= 2) {
                    modalResults[0].textContent = dto.player1CaughtCount || 0;
                    modalResults[1].textContent = dto.player2CaughtCount || 0;
                }

                const playAgainButton = loseModal.querySelector('.button');
                if (playAgainButton) {
                    playAgainButton.onclick = () => {
                        location.reload();
                    };
                }
            }
        }
    }
}