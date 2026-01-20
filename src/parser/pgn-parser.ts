import { Token, TokenType, PGNTokenizer } from './tokenizer.js';
import { parseHeader } from './header-parser.js';
import { parseAnnotations } from '../utils/annotation-parser.js';
import { MoveNode, createRootNode } from '../model/move-node.js';
import { PGNGame, createPGNGame } from '../model/pgn-game.js';

/**
 * Main PGN parser that converts PGN text into a game tree structure.
 */
export class PGNParser {
    private tokens: Token[] = [];
    private position: number = 0;
    private nodeIdCounter: number = 0;

    /**
     * Parses PGN text and returns a PGNGame object.
     */
    parse(pgnText: string): PGNGame {
        const tokenizer = new PGNTokenizer(pgnText);
        this.tokens = tokenizer.tokenize();
        this.position = 0;
        this.nodeIdCounter = 0;

        // Parse headers
        const headers = this.parseHeaders();

        // Create root node
        const root = createRootNode();

        // Parse moves starting from root
        this.parseMoveSequence(root, 0);

        return createPGNGame(headers, root);
    }

    /**
     * Parses all headers at the beginning of the PGN.
     */
    private parseHeaders(): Record<string, string> {
        const headers: Record<string, string> = {};

        while (this.current().type === TokenType.HEADER) {
            const headerToken = this.consume(TokenType.HEADER);
            const parsed = parseHeader(headerToken.value);
            if (parsed) {
                headers[parsed.key] = parsed.value;
            }
        }

        return headers;
    }

    /**
     * Parses a sequence of moves and variations, building the tree structure.
     * Returns the FIRST node created in this sequence (for variations).
     */
    private parseMoveSequence(
        parentNode: MoveNode,
        startPly: number
    ): MoveNode | undefined {
        let currentNode = parentNode;
        let ply = startPly;
        let pendingComment: string | undefined;
        let firstNode: MoveNode | undefined; // Track the first node we create

        while (!this.isAtEnd()) {
            const token = this.current();

            // End of variation
            if (token.type === TokenType.VARIATION_END) {
                return firstNode; // Return first node, not current
            }

            // Comment before move
            if (token.type === TokenType.COMMENT) {
                const comment = this.consume(TokenType.COMMENT).value;
                pendingComment = pendingComment
                    ? `${pendingComment} ${comment}`
                    : comment;
                continue;
            }

            // Skip move numbers
            if (token.type === TokenType.MOVE_NUMBER) {
                this.advance();
                continue;
            }

            // Result marker (end of game)
            if (token.type === TokenType.RESULT) {
                this.advance();
                break;
            }

            // Variation start
            if (token.type === TokenType.VARIATION_START) {
                this.consume(TokenType.VARIATION_START);

                // Variations are stored on the move they replace (currentNode)
                // but they branch from the parent's position
                // For example: "1. e4 e5 (1... c5)" - variation stored on e5, but branches from e4's position
                const variationParent = currentNode.parent || parentNode;
                const variationPly = currentNode.ply; // Same ply as the move being replaced

                // Parse the variation
                const variationStart = this.parseMoveSequence(variationParent, variationPly);

                if (variationStart && variationStart !== variationParent) {
                    currentNode.variations.push(variationStart);
                }

                this.consume(TokenType.VARIATION_END);
                continue;
            }

            // Move
            if (token.type === TokenType.MOVE) {
                const moveToken = this.consume(TokenType.MOVE);
                const color = ply % 2 === 0 ? 'w' : 'b';
                const moveNumber = Math.floor(ply / 2) + 1;

                // Collect NAGs
                const nags: number[] = [];
                while (this.current().type === TokenType.NAG) {
                    const nagToken = this.consume(TokenType.NAG);
                    const nagValue = parseInt(nagToken.value.slice(1)); // Remove '$'
                    nags.push(nagValue);
                }

                // Collect comment after move
                let commentAfter: string | undefined;
                const annotations: {
                    clock?: number;
                    emt?: number;
                    eval?: number;
                    depth?: number;
                } = {};

                if (this.current().type === TokenType.COMMENT) {
                    const commentToken = this.consume(TokenType.COMMENT);
                    const parsed = parseAnnotations(commentToken.value);

                    if (parsed.clock !== undefined) annotations.clock = parsed.clock;
                    if (parsed.emt !== undefined) annotations.emt = parsed.emt;
                    if (parsed.eval !== undefined) annotations.eval = parsed.eval;
                    if (parsed.depth !== undefined) annotations.depth = parsed.depth;

                    if (parsed.cleanComment) {
                        commentAfter = parsed.cleanComment;
                    }
                }

                // Create new move node
                const newNode: MoveNode = {
                    id: this.generateNodeId(),
                    ply,
                    moveNumber,
                    color,
                    san: moveToken.value,
                    nags,
                    commentBefore: pendingComment,
                    commentAfter,
                    ...annotations,
                    parent: currentNode,
                    variations: [],
                };

                // Link to parent
                if (currentNode.next === undefined) {
                    currentNode.next = newNode;
                }

                // Track first node created
                if (!firstNode) {
                    firstNode = newNode;
                }

                currentNode = newNode;
                ply++;
                pendingComment = undefined;
            } else {
                // Unknown token, skip
                this.advance();
            }
        }

        return firstNode; // Return first node for variations
    }

    private current(): Token {
        return this.tokens[this.position] || { type: TokenType.EOF, value: '', line: 0, column: 0 };
    }

    private advance(): Token {
        return this.tokens[this.position++];
    }

    private consume(expectedType: TokenType): Token {
        const token = this.current();
        if (token.type !== expectedType) {
            throw new Error(
                `Expected token type ${expectedType}, got ${token.type} at line ${token.line}`
            );
        }
        return this.advance();
    }

    private isAtEnd(): boolean {
        return this.current().type === TokenType.EOF;
    }

    private generateNodeId(): string {
        return `node_${this.nodeIdCounter++}`;
    }
}

/**
 * Convenience function to parse PGN text.
 */
export function parsePGN(pgnText: string): PGNGame {
    const parser = new PGNParser();
    return parser.parse(pgnText);
}
