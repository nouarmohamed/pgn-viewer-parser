import { describe, it, expect } from 'vitest';
import { parsePGN } from '../../src/parser/pgn-parser';

describe('PGN Parser - Variations', () => {
    it('should parse a simple variation', () => {
        const pgn = `
[Event "Test"]

1. e4 e5 (1... c5 2. Nf3) 2. Nf3
`;

        const game = parsePGN(pgn);

        expect(game.headers.Event).toBe('Test');

        // Check mainline: e4 e5 Nf3
        const e4 = game.root.next;
        expect(e4?.san).toBe('e4');

        const e5 = e4?.next;
        expect(e5?.san).toBe('e5');

        // Check variation: c5 Nf3
        expect(e5?.variations.length).toBe(1);
        const c5 = e5?.variations[0];
        expect(c5?.san).toBe('c5');

        const nf3Var = c5?.next;
        expect(nf3Var?.san).toBe('Nf3');

        // Check mainline continues
        const nf3Main = e5?.next;
        expect(nf3Main?.san).toBe('Nf3');
    });

    it('should parse nested variations', () => {
        const pgn = `
1. e4 e5 (1... c5 2. Nf3 (2. Nc3 Nc6) 2... d6) 2. Nf3
`;

        const game = parsePGN(pgn);

        const e4 = game.root.next;
        const e5 = e4?.next;

        // First variation: c5
        const c5 = e5?.variations[0];
        expect(c5?.san).toBe('c5');

        const nf3Var = c5?.next;
        expect(nf3Var?.san).toBe('Nf3');

        // Nested variation: Nc3
        expect(nf3Var?.variations.length).toBe(1);
        const nc3 = nf3Var?.variations[0];
        expect(nc3?.san).toBe('Nc3');

        const nc6 = nc3?.next;
        expect(nc6?.san).toBe('Nc6');

        // Continue first variation
        const d6 = nf3Var?.next;
        expect(d6?.san).toBe('d6');
    });

    it('should parse multiple variations at the same position', () => {
        const pgn = `
1. e4 e5 (1... c5) (1... e6) 2. Nf3
`;

        const game = parsePGN(pgn);

        const e4 = game.root.next;
        const e5 = e4?.next;

        expect(e5?.variations.length).toBe(2);
        expect(e5?.variations[0].san).toBe('c5');
        expect(e5?.variations[1].san).toBe('e6');
    });

    it('should handle variations with comments', () => {
        const pgn = `
1. e4 e5 (1... c5 {Sicilian Defense} 2. Nf3) 2. Nf3
`;

        const game = parsePGN(pgn);

        const e4 = game.root.next;
        const e5 = e4?.next;
        const c5 = e5?.variations[0];

        expect(c5?.san).toBe('c5');
        expect(c5?.commentAfter).toBe('Sicilian Defense');
    });
});
