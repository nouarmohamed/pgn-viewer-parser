/**
 * Represents a single move node in the game tree.
 * Each node can have a mainline continuation (next) and alternative variations.
 */
export interface MoveNode {
    /** Unique identifier for this node */
    id: string;

    /** Ply number (half-moves from start, 0-indexed) */
    ply: number;

    /** Move number in chess notation (1, 2, 3, etc.) */
    moveNumber: number;

    /** Color to move: 'w' for white, 'b' for black */
    color: 'w' | 'b';

    /** Standard Algebraic Notation of the move (e.g., "e4", "Nf3", "O-O") */
    san: string;

    /** Numeric Annotation Glyphs (e.g., $1 = "!", $2 = "?") */
    nags: number[];

    /** Comment appearing before this move */
    commentBefore?: string;

    /** Comment appearing after this move */
    commentAfter?: string;

    /** Clock time remaining in seconds */
    clock?: number;

    /** Elapsed move time in seconds */
    emt?: number;

    /** Position evaluation in centipawns (positive = white advantage) */
    eval?: number;

    /** Search depth for the evaluation */
    depth?: number;

    /** Parent node (undefined for root) */
    parent?: MoveNode;

    /** Next move in the mainline */
    next?: MoveNode;

    /** Alternative variations from this position */
    variations: MoveNode[];
}

/**
 * Creates a new MoveNode with the given properties.
 */
export function createMoveNode(props: {
    id: string;
    ply: number;
    moveNumber: number;
    color: 'w' | 'b';
    san: string;
    nags?: number[];
    commentBefore?: string;
    commentAfter?: string;
    clock?: number;
    emt?: number;
    eval?: number;
    depth?: number;
    parent?: MoveNode;
}): MoveNode {
    return {
        ...props,
        nags: props.nags || [],
        variations: [],
    };
}

/**
 * Creates a root node (starting position with no move).
 */
export function createRootNode(): MoveNode {
    return {
        id: 'root',
        ply: -1,
        moveNumber: 0,
        color: 'w',
        san: '',
        nags: [],
        variations: [],
    };
}
