import {GameStatuses} from "../GAME_STATUSES.js";
import {ShogunNumberUtility} from "./shogun-number-utility.js";

export class   Game {
    #settings = {
        gridSize: new GridSize(4, 4),
        googleJumpInterval: 1000
    }

    #observers = []
    subscribe(observerFunction) {
        this.#observers.push(observerFunction)
    }
    #notify() {
        this.#observers.forEach(o => o())
    }

    #status = GameStatuses.SETTINGS
    #googlePosition = null
    #player1Position = null
    #player2Position = null
    #googleJumpCount = 0;
    #jumpIntervalId = null;
    #player1CaughtCount = 0;
    #player2CaughtCount = 0;

    /**
     * @type ShogunNumberUtility
     */
    #shogunNumberUtility;
    constructor(somethingSimilarToNumberUtility){
        this.#shogunNumberUtility = somethingSimilarToNumberUtility
    }

    set googleJumpInterval(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error('Google Jump interval must be a positive number')
        }
        this.#settings.googleJumpInterval = value;
        this.#notify()
    }

    get status() {
        return this.#status;
    }

    get gridSize() {
        return this.#settings.gridSize;
    }

    set gridSize(value) {
        this.#settings.gridSize = value;
    }

    get googlePosition() {
        return this.#googlePosition;
    }

    get player1Position() {
        return this.#player1Position;
    }
    get player2Position() {
        return this.#player2Position;
    }
    get Player1CaughtCount() {
        return this.#player1CaughtCount;
    }
    get Player2CaughtCount() {
        return this.#player2Position
    }
    /**
     * Sets the grid size for the game
     *
     * @param {GridSize} value - The new grid size to set
     */
    set gridSize(value) {
        this.#settings.gridSize = value;
        this.#notify()
    }


    start() {
        if (this.#status !== GameStatuses.SETTINGS) {
            throw  new Error('Game must be in Settings before start')
        }
        this.#status = GameStatuses.IN_PROGRESS;
        this.#googleJumpCount = 0;
        this.#player1CaughtCount = 0;
        this.#player2CaughtCount = 0;
        this.#placePlayer1ToGrid();
        this.#placePlayer2ToGrid();
        this.#makeGoogleJump()
        this.#notify()
        this.#jumpIntervalId = setInterval(() => {
            this.#makeGoogleJump()
            this.#notify()
            this.#googleJumpCount++
            if (this.#googleJumpCount >= 10) {
                clearInterval(this.#jumpIntervalId)
                this.#status = GameStatuses.LOSE
            }
        }, this.#settings.googleJumpInterval);
        this.#notify()
    }
    #placePlayer1ToGrid() {
        const newPosition = {
            x: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.columnsCount),
            y: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.rowsCount),
        }
        this.#player1Position = newPosition;
    }
    #placePlayer2ToGrid() {
        const newPosition = {
            x: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.columnsCount),
            y: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.rowsCount),
        }
        if (newPosition.x === this.#player1Position?.x && newPosition.y === this.#player1Position?.y) {
            this.#placePlayer2ToGrid();
            return;
        }
        this.#player2Position = newPosition;
    }
    #makeGoogleJump() {
        const newPosition = {
            x: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.columnsCount),
            y: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.rowsCount),
        }
        if (newPosition.x === this.#googlePosition?.x && newPosition.y === this.#googlePosition?.y ||
            newPosition.x === this.#player1Position?.x && newPosition.y === this.#player1Position?.y ||
            newPosition.x === this.#player2Position?.x && newPosition.y === this.#player2Position?.y) {
            this.#makeGoogleJump();
            return;
        }
        //this.#checkGoogleCaught(playerNumber)
        this.#googlePosition = newPosition;
    }
    #checkGoogleCaught(playerNumber) {
        const playerPosition = this['player' + playerNumber + 'Position'];
        if (this.googlePosition &&
            playerPosition.x === this.#googlePosition.x &&
            playerPosition.y === this.#googlePosition.y
        ) {
            if (playerNumber === 1) {
                this.#player1CaughtCount++
            } else {
                this.#player2CaughtCount++
            }
        }
        if (this.#player1CaughtCount >= 20) {
            this.#status = GameStatuses.WIN
        } else if(this.#player2CaughtCount >= 20) {
            this.#status = GameStatuses.WIN
        } else {
            this.#makeGoogleJump()
        }
        this.#notify()
    }
    //todo: movedirection to constans
    movePlayer(playerNumber, moveDirection) {

        const position = this['player' + playerNumber + 'Position']
        let newPosition;
        switch (moveDirection) {
            case 'UP' : {
                newPosition = {
                    x: position.x,
                    y: position.y - 1
                }
                break;
            }
            case 'DOWN' : {
                newPosition = {
                    x: position.x,
                    y: position.y + 1
                }
                break;
            }
            case 'RIGHT' : {
                newPosition = {
                    x: position.x + 1,
                    y: position.y
                }
                break;
            }
            case 'LEFT' : {
                newPosition = {
                    x: position.x - 1,
                    y: position.y
                }
                break;
            }
        }
        if(
            newPosition.x >= this.gridSize.columnsCount ||
            newPosition.x < 0 ||
            newPosition.y >= this.gridSize.rowsCount ||
            newPosition.y < 0
        ) {
            return
        }
        //  this['#position.player' + playerNumber] = newPosition

        if (playerNumber === 1) {
            this.#player1Position = newPosition;
        } else {
            this.#player2Position = newPosition;
        }
        this.#notify()
    }

}

class GridSize  {
    constructor(rowsCount = 4,  columnsCount = 4) {
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
    }
}
