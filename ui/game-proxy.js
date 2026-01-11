
export class GameProxy {
    #wsChannel = null;
    #stateCache = null;
    #pendingActions = [];
    constructor(somethingSimilarToNumberUtility){
        this.#wsChannel = new WebSocket('ws://localhost:8080');

        this.#wsChannel.addEventListener('open', () => {
            this.#pendingActions.forEach((action) => {
                this.#wsChannel.send(JSON.stringify(action));
            });
            this.#pendingActions = [];
        });

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

    #sendAction(action) {
        if (this.#wsChannel.readyState === WebSocket.OPEN) {
            this.#wsChannel.send(JSON.stringify(action));
            return;
        }
        this.#pendingActions.push(action);
    }

    set googleJumpInterval(value) {

    }

    get status() {
        return this.#stateCache.status
    }

    get gridSize() {
        return this.#stateCache.gridSize
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
    get totalCaughtCount() {
        return this.#stateCache.totalCaughtCount
    }
    get googleEscapeCount() {
        return this.#stateCache.googleEscapeCount
    }
    get pointsToWin() {
        return this.#stateCache.pointsToWin
    }
    get pointsToLose() {
        return this.#stateCache.pointsToLose
    }
    /**
     * Sets the grid size for the game
     *
     * @param {GridSize} value - The new grid size to set
     */
    set gridSize(value) {

    }

    updateSettings(settings) {
        const action = {type: 'update-settings', payload: settings }
        this.#sendAction(action)
    }

    start() {
        const action = {type: 'start'}
        this.#sendAction(action);
    }


    //todo: movedirection to constans
    movePlayer(playerNumber, moveDirection) {
        const action = {type: 'move-player', payload: {playerNumber, moveDirection} }
        this.#sendAction(action)

    }

}

