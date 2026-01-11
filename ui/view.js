import {GameStatuses} from "../GAME_STATUSES.js";

export class View {
    onstart = null;
    onplayermove = null;
    onsettingschange = null;

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

        const gridSizeSelect = document.getElementById('01');
        const pointsToWinSelect = document.getElementById('02');
        const pointsToLoseSelect = document.getElementById('03');

        const settingsHandler = () => {
            const gridSize = Number.parseInt(gridSizeSelect?.value || '', 10);
            const pointsToWin = Number.parseInt(pointsToWinSelect?.value || '', 10);
            const pointsToLose = Number.parseInt(pointsToLoseSelect?.value || '', 10);

            if (!Number.isInteger(gridSize) || !Number.isInteger(pointsToWin) || !Number.isInteger(pointsToLose)) {
                return;
            }

            this.onsettingschange?.({
                gridSize: {rowsCount: gridSize, columnsCount: gridSize},
                pointsToWin,
                pointsToLose
            });
        };

        gridSizeSelect?.addEventListener('change', settingsHandler);
        pointsToWinSelect?.addEventListener('change', settingsHandler);
        pointsToLoseSelect?.addEventListener('change', settingsHandler);
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
            catchElements[0].textContent = dto.totalCaughtCount || 0;
            catchElements[1].textContent = dto.googleEscapeCount || 0;
        }
    }

    #updateGameStatus(dto) {
        const modals = document.querySelectorAll('.modal');

        modals.forEach(modal => {
            modal.classList.remove('is-open');
        });

        if (dto.status === GameStatuses.WIN) {
            const winModal = document.querySelector('.modal-win');
            if (winModal) {
                winModal.classList.add('is-open');
                const modalResults = winModal.querySelectorAll('.result-block .result');
                if (modalResults.length >= 2) {
                    modalResults[0].textContent = dto.totalCaughtCount || 0;
                    modalResults[1].textContent = dto.googleEscapeCount || 0;
                }

                const playAgainButton = winModal.querySelector('.button');
                if (playAgainButton) {
                    playAgainButton.onclick = () => {
                        this.onstart?.();
                    };
                }
            }
        } else if (dto.status === GameStatuses.LOSE) {
            const loseModal = document.querySelector('.modal-lose');
            if (loseModal) {
                loseModal.classList.add('is-open');
                const modalResults = loseModal.querySelectorAll('.result-block .result');
                if (modalResults.length >= 2) {
                    modalResults[0].textContent = dto.totalCaughtCount || 0;
                    modalResults[1].textContent = dto.googleEscapeCount || 0;
                }

                const playAgainButton = loseModal.querySelector('.button');
                if (playAgainButton) {
                    playAgainButton.onclick = () => {
                        this.onstart?.();
                    };
                }
            }
        }
    }
}
