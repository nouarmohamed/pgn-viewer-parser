import { describe, it, expect } from 'vitest';
import { parsePGN } from '../../src/parser/pgn-parser';

describe('Full Game Integration', () => {
    it('should parse a complete game with all features', () => {
        const pgn = `
[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.01.15"]
[White "Magnus Carlsen"]
[Black "Hikaru Nakamura"]
[Result "1-0"]

1. e4 {King's pawn opening} e5 2. Nf3 Nc6 3. Bb5 {Ruy Lopez} a6 
(3... Nf6 {Berlin Defense} 4. O-O Nxe4) 
4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 
11. d4 $1 {Excellent move!} Qc7 {[%clk 0:04:32][%eval +0.35][%depth 18]} 1-0
`;

        const game = parsePGN(pgn);

        // Check headers
        expect(game.headers.Event).toBe('Live Chess');
        expect(game.headers.White).toBe('Magnus Carlsen');
        expect(game.headers.Black).toBe('Hikaru Nakamura');
        expect(game.headers.Result).toBe('1-0');

        // Check first move with comment
        const e4 = game.root.next;
        expect(e4?.san).toBe('e4');
        expect(e4?.commentAfter).toBe("King's pawn opening");

        // Navigate to Bb5
        const bb5 = e4?.next?.next?.next?.next;
        expect(bb5?.san).toBe('Bb5');
        expect(bb5?.commentAfter).toBe('Ruy Lopez');

        // Check variation (Berlin Defense)
        const a6 = bb5?.next;
        expect(a6?.variations.length).toBe(1);
        const nf6 = a6?.variations[0];
        expect(nf6?.san).toBe('Nf6');
        expect(nf6?.commentAfter).toBe('Berlin Defense');

        // Find d4 with NAG
        let current = game.root.next;
        while (current && current.san !== 'd4') {
            current = current.next;
        }
        expect(current?.san).toBe('d4');
        expect(current?.nags).toContain(1); // $1 = "!"
        expect(current?.commentAfter).toBe('Excellent move!');

        // Check Qc7 with annotations
        const qc7 = current?.next;
        expect(qc7?.san).toBe('Qc7');
        expect(qc7?.clock).toBe(272); // 4:32 = 272 seconds
        expect(qc7?.eval).toBe(0.35);
        expect(qc7?.depth).toBe(18);
    });

    it('should handle empty game', () => {
        const pgn = `
[Event "Empty Game"]

*
`;

        const game = parsePGN(pgn);

        expect(game.headers.Event).toBe('Empty Game');
        expect(game.root.next).toBeUndefined();
    });

    it('should handle game with only comments', () => {
        const pgn = `
[Event "Comments Only"]

{This is a starting comment}
*
`;

        const game = parsePGN(pgn);

        expect(game.headers.Event).toBe('Comments Only');
    });

    it('should parse Scholar\'s Mate', () => {
        const pgn = `
1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7# 1-0
`;

        const game = parsePGN(pgn);

        let current = game.root.next;
        const moves: string[] = [];

        while (current) {
            moves.push(current.san);
            current = current.next;
        }

        expect(moves).toEqual(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#']);
    });

    it('should handle castling notation', () => {
        const pgn = `
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O Nf6 5. d3 O-O
`;

        const game = parsePGN(pgn);

        let current = game.root.next;
        const moves: string[] = [];

        while (current) {
            moves.push(current.san);
            current = current.next;
        }

        expect(moves).toContain('O-O');
    });
});
