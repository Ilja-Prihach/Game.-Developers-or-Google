
export class Controller {
    #view
    #model
    constructor(somethingLikeView,  somethingLikeModel) {
        this.#view = somethingLikeView;
        this.#model = somethingLikeModel;

        this.#model.subscribe(() => {
            this.#render()
        })
        this.#model.subscribe(() => {
            console.log('State changed')
        })

        this.#view.onplayermove = (playerNumber, direction) => {
            this.#model.movePlayer(playerNumber, direction)
        }

        this.#view.onstart = () => {
            this.#model.start();
            this.#render()
        }
    }
    init() {
        this.#render()
    }
    #render() {
        const dto = {
            status: this.#model.status,
            gridSize: this.#model.gridSize,
            googlePosition: this.#model.googlePosition,
            player1Position: this.#model.player1Position,
            player2Position: this.#model.player2Position,
        }
        this.#view.render(dto)
    }
}