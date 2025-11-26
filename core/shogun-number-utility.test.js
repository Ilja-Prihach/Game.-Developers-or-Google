import {ShogunNumberUtility} from './shogun-number-utility.js'

describe('ShogunNumberUtility', () => {
    const utility = new ShogunNumberUtility();

    test('returns an integer withing range', () => {
        const from = 1;
        const to = 5;
        for (let i = 0; i < 100; i++) {
            const result = utility.getRandomInteger(from, to);
            expect(result).toBeGreaterThanOrEqual(from);
            expect(result).toBeLessThan(to);
            expect(Number.isInteger(result)).toBe(true);
        }
    })

    test('throws error if fromInclusive is greater than toExclusive', () => {
        const from = 5;
        const to = 3;
        expect(() => utility.getRandomInteger(from, to)).toThrow(Error);
    })


})