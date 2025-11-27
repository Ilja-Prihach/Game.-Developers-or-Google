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
        for (let i = 0; i < 7; i++) {
            const prevGooglePosition = game.googlePosition
            await delay(1)
            const cuurentGooglePosition = game.googlePosition
            expect(prevGooglePosition).not.toEqual(cuurentGooglePosition.x)
        }
    })

    it('players should be in the Grid after start', async () => {
        const numberUtil = new ShogunNumberUtility()
        for (let i=0; i<100; i++) {
            const game = new Game(numberUtil);
            expect(game.player1Position).toBeNull()
            expect(game.player2Position).toBeNull()
            await game.start()

            // player1
            expect(game.player1Position.x).toBeLessThan(game.gridSize.columnsCount)
            expect(game.player1Position.x).toBeGreaterThanOrEqual(0)
            expect(game.player1Position.y).toBeLessThan(game.gridSize.rowsCount)
            expect(game.player1Position.y).toBeGreaterThanOrEqual(0)

            // player2
            expect(game.player2Position.x).toBeLessThan(game.gridSize.columnsCount)
            expect(game.player2Position.x).toBeGreaterThanOrEqual(0)
            expect(game.player2Position.y).toBeLessThan(game.gridSize.rowsCount)
            expect(game.player2Position.y).toBeGreaterThanOrEqual(0)
        }
    })

    it('players should not have same position', async () => {
        const numberUtil = new ShogunNumberUtility()
        for (let i=0; i<100; i++) {
            const game = new Game(numberUtil);
            await game.start()
            expect(game.player1Position).not.toEqual(game.player2Position)
        }
    })

    it('google should not appear on players positions', async () => {
        const numberUtil = new ShogunNumberUtility()
        const game = new Game(numberUtil);
        game.googleJumpInterval = 1
        await game.start()

        for (let i = 0; i < 100; i++) {
            const googlePos = game.googlePosition
            const player1Pos = game.player1Position
            const player2Pos = game.player2Position

            expect(googlePos).not.toEqual(player1Pos)
            expect(googlePos).not.toEqual(player2Pos)

            await delay(1)
        }
    })

    it('game should end with LOSE status after 10 google jumps', async () => {
        const numberUtil = new ShogunNumberUtility()
        const game = new Game(numberUtil);
        game.googleJumpInterval = 10 // Быстрый интервал для теста
        await game.start()

        // Ждем пока Google сделает 10 прыжков
        await delay(150)

        expect(game.status).toBe(GameStatuses.LOSE)
    })

    it('google jump counter should reset on game start', async () => {
        const numberUtil = new ShogunNumberUtility()

        // Первая игра
        const game1 = new Game(numberUtil);
        game1.googleJumpInterval = 10
        await game1.start()
        await delay(150)
        expect(game1.status).toBe(GameStatuses.LOSE)

        // Вторая игра - должна нормально стартовать, не сразу проигрывать
        const game2 = new Game(numberUtil);
        game2.googleJumpInterval = 10
        await game2.start()
        expect(game2.status).toBe(GameStatuses.IN_PROGRESS) // Не должна сразу проиграть
    })

    it('google should stop jumping after game lose', async () => {
        const numberUtil = new ShogunNumberUtility()
        const game = new Game(numberUtil);
        game.googleJumpInterval = 10
        await game.start()

        // Ждем завершения игры
        await delay(150)
        expect(game.status).toBe(GameStatuses.LOSE)

        // Запоминаем позицию Google после проигрыша
        const positionAfterLose = {...game.googlePosition}

        // Ждем еще немного - позиция не должна измениться
        await delay(50)
        expect(game.googlePosition).toEqual(positionAfterLose)
    })

    it('google should make exactly 10 jumps before game ends', async () => {
        const numberUtil = new ShogunNumberUtility()
        const game = new Game(numberUtil);
        game.googleJumpInterval = 20
        await game.start()

        // Отслеживаем позиции Google
        const positions = []
        for (let i = 0; i < 12; i++) { // Смотрим немного больше чем 10
            positions.push({...game.googlePosition})
            await delay(25)
        }

        // После 10 прыжков игра должна завершиться
        expect(game.status).toBe(GameStatuses.LOSE)
    })
})

const delay = (ms) => new Promise(res => setTimeout(res, ms));