

export class GameProxy {
    #wsChannel = null;
    #stateCache = null;
    constructor(somethingSimilarToNumberUtility){
        this.#wsChannel = new WebSocket('ws://localhost:8080');

        this.#wsChannel.addEventListener('message', (event) => {
            const receivedData = JSON.parse(event.data);
            this.#stateCache = receivedData;
            this.#notify()
        })
    }

    get initialized() {
        return this.#stateCache !== null;
    }


    #observers = []
    subscribe(observerFunction) {
        this.#observers.push(observerFunction)
    }
    #notify() {
        this.#observers.forEach(o => o())
    }



    set googleJumpInterval(value) {

    }

    get status() {
        return this.#stateCache.status
    }

    get gridSize() {
        return this.#stateCache.gridSize
    }

    set gridSize(value) {

    }

    get googlePosition() {
        return this.#stateCache.googlePosition
    }

    get player1Position() {
        return this.#stateCache.player1Position
    }
    get player2Position() {
        return this.#stateCache.player2Position
    }
    get player1CaughtCount() {
        return this.#stateCache.player1CaughtCount
    }
    get player2CaughtCount() {
        return this.#stateCache.player2CaughtCount
    }
    /**
     * Sets the grid size for the game
     *
     * @param {GridSize} value - The new grid size to set
     */
    set gridSize(value) {

    }


    start() {
        const action = {type: 'start'}
        setTimeout(() => {
            this.#wsChannel.send(JSON.stringify(action))
        }, 100)
    }


    //todo: movedirection to constans
    movePlayer(playerNumber, moveDirection) {
        const action = {type: 'move-player', payload: {playerNumber, moveDirection} }
        this.#wsChannel.send(JSON.stringify(action))

    }

}

