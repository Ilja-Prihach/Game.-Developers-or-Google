import {Game} from "./game.js";
import {GameStatuses} from "../GAME_STATUSES.js";
import {ShogunNumberUtility} from "./shogun-number-utility.js";

describe('game', () => {
    it('should have Pending status after creating', () => {
        const game = new Game();
        expect(game.status).toBe(GameStatuses.SETTINGS);
    })

    it('should have InProgress status after creating', async () => {
        const numberUtil = new ShogunNumberUtility()
        const game = new Game(numberUtil);
        await game.start()
        expect(game.status).toBe(GameStatuses.IN_PROGRESS);
    })

    it('google should be in the Grid after start', async () => {
        const numberUtil = new ShogunNumberUtility()
        for (let i=0; i<100; i++) {
            const game = new Game(numberUtil);
            expect(game.googlePosition).toBeNull()
            await game.start()
            expect(game.googlePosition.x).toBeLessThan(game.gridSize.columnsCount)
            expect(game.googlePosition.x).toBeGreaterThanOrEqual(0)
            expect(game.googlePosition.y).toBeLessThan(game.gridSize.rowsCount)
            expect(game.googlePosition.y).toBeGreaterThanOrEqual(0)
        }
    })

    it('google should be in the Grid but in new position after jump', async () => {
        const numberUtil = new ShogunNumberUtility()
        const game = new Game(numberUtil);
        game.googleJumpInterval = 1
        await game.start()
        for (let i = 0; i < 100; i++) {
            const prevGooglePosition = game.googlePosition
            await delay(1)
            const cuurentGooglePosition = game.googlePosition
            expect(prevGooglePosition).not.toEqual(cuurentGooglePosition.x)
        }
    })
})

const delay = (ms) => new Promise(res => setTimeout(res, ms));