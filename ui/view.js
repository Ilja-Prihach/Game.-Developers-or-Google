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
                default:
                    return
            }
            // onplavermove()
        })
    }

    render(dto) {
        const rootElement = document.getElementById('root');
        rootElement.innerHTML = ""
        rootElement.append("status " + dto.status)

        if (dto.status === GameStatuses.SETTINGS) {
            const settingsComponent = new SettingsComponent({onstart: this.onstart})
            const settingsElement = settingsComponent.render(dto)
            rootElement.append(settingsElement);
        } else if(dto.status === GameStatuses.IN_PROGRESS) {
            const gridComponent = new GridComponent({onplavermove: this.onplayermove})
            const gridElement = gridComponent.render(dto)
            rootElement.append(gridElement);
        }
    }
}

class SettingsComponent {
    #props;
    constructor(props) {
        this.#props = props;
    }
    render(dto) {
        const container = document.createElement('div');
        container.classList.add('container');

        const button = document.createElement("button");
        button.append("START GAME")
        button.classList.add('btn', 'btn-primary');
        //observer наблюдатель
        button.onclick = () => {
            this.#props?.onstart?.()
        }
        container.append(button);
        return container
    }
}

class GridComponent  {

    render(dto) {
        const container = document.createElement('table');

        for (let y = 0; y < dto.gridSize.rowsCount ; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < dto.gridSize.columnsCount ; x++) {
                const cell = document.createElement('td');

                if(dto.player1Position.x === x && dto.player1Position.y === y ) {
                    cell.textContent = '🧑‍💻'
                } else if(dto.player2Position.x === x && dto.player2Position.y === y ) {
                    cell.textContent = '👨🏻‍💻'
                } else if(dto.googlePosition.x === x && dto.googlePosition.y === y ) {
                    cell.textContent = '💰'
                }
                row.append(cell);
            }
            container.append(row)
        }
        return container;
    }
}