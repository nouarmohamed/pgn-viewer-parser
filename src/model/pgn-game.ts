import { MoveNode } from './move-node.js';

/**
 * Represents a complete chess game parsed from PGN.
 */
export interface PGNGame {
    /** PGN headers (Event, Site, Date, White, Black, Result, etc.) */
    headers: Record<string, string>;

    /** Root node of the game tree (starting position) */
    root: MoveNode;
}

/**
 * Creates a new PGNGame with the given headers and root node.
 */
export function createPGNGame(
    headers: Record<string, string> = {},
    root?: MoveNode
): PGNGame {
    return {
        headers,
        root: root || {
            id: 'root',
            ply: 0,
            moveNumber: 0,
            color: 'w',
            san: '',
            nags: [],
            variations: [],
        },
    };
}
