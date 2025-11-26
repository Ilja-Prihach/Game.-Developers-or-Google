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

    #status = GameStatuses.SETTINGS;

    #googlePosition = null
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

    start() {
        if (this.#status !== GameStatuses.SETTINGS) {
            throw  new Error('Game must be in Settings before start')
        }
        this.#status = GameStatuses.IN_PROGRESS;
        this.#makeGoogleJump()
        setInterval(() => {
            this.#makeGoogleJump()
        }, this.#settings.googleJumpInterval);
    }
    #makeGoogleJump() {
         const newPosition = {
            x: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.columnsCount),
            y: this.#shogunNumberUtility.getRandomInteger(0, this.#settings.gridSize.rowsCount),
        }
        if (newPosition.x === this.googlePosition?.x && newPosition.y === this.googlePosition?.y) {
            this.#makeGoogleJump()
            return
        }
        this.#googlePosition = newPosition
    }
}
