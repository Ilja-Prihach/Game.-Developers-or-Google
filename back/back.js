import {ShogunNumberUtility} from "../core/shogun-number-utility.js";
import {Game} from "../core/game.js";
import {WebSocketServer} from "ws";


const numberUtil = new ShogunNumberUtility()
const game = new Game(numberUtil);
//game.start()

function createDTO(){
    const dto = {
        status: game.status,
        gridSize: game.gridSize,
        googlePosition: game.googlePosition,
        player1Position: game.player1Position,
        player2Position: game.player2Position,
        player1CaughtCount: game.player1CaughtCount,
        player2CaughtCount: game.player2CaughtCount,
        totalCaughtCount: game.totalCaughtCount,
        googleEscapeCount: game.googleEscapeCount,
        pointsToWin: game.pointsToWin,
        pointsToLose: game.pointsToLose
    }
    return dto;
}


const wss = new WebSocketServer({port: 8080})

wss.on('connection', (channel) => {
    game.subscribe(() => {
        channel.send(JSON.stringify(createDTO()));
    })
    channel.on('message', (message) => {
        const action = JSON.parse(message.toString())
        switch (action.type) {
            case 'start': {
                game.start();
                break;
            }
            case 'move-player': {
                game.movePlayer(action.payload.playerNumber, action.payload.moveDirection);
                break;
            }
            case 'update-settings': {
                game.updateSettings(action.payload || {});
                break;
            }
        }
    })
    channel.send(JSON.stringify(createDTO()));
})

console.log("WebSocket server is running on ws://localhost:8080")
