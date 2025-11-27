import {GameStatuses} from "../GAME_STATUSES.js";
import {ShogunNumberUtility} from "./shogun-number-utility.js";

export class   Game {
    #settings = {
        gridSize: {
            rowsCount: 4,
            columnsCount: 4,
        },
        googleJumpInterval: 1000
    }

    #status = GameStatuses.SETTINGS
    #googlePosition = null
    #player1Position = null
    #player2Position = null
    #googleJumpCount = 0;        // ← новое поле для счетчика
    #jumpIntervalId = null;

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
    }

    get status() {
        return this.#status;
    }

    get gridSize() {
        return this.#settings.gridSize;
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

    start() {
        if (this.#status !== GameStatuses.SETTINGS) {
            throw  new Error('Game must be in Settings before start')
        }
        this.#status = GameStatuses.IN_PROGRESS;
        this.#googleJumpCount = 0;
        this.#startPositionPlayer1();
        this.#startPositionPlayer2();
        this.#makeGoogleJump()
        this.#jumpIntervalId = setInterval(() => {
            this.#makeGoogleJump()
            this.#googleJumpCount++
            if (this.#googleJumpCount >= 10) {
                clearInterval(this.#jumpIntervalId)
                this.#status = GameStatuses.LOSE
            }
        }, this.#settings.googleJumpInterval);
    }
    #startPositionPlayer1() {
        const newPosition = {
            x: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.columnsCount),
            y: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.rowsCount),
        }
        this.#player1Position = newPosition;
    }

    #startPositionPlayer2() {
        const newPosition = {
            x: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.columnsCount),
            y: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.rowsCount),
        }
        if (newPosition.x === this.#player1Position?.x && newPosition.y === this.#player1Position?.y) {
            this.#startPositionPlayer2();
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
        this.#googlePosition = newPosition;
    }

}
