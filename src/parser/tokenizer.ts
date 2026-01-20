/**
 * Token types for PGN lexical analysis
 */
export enum TokenType {
    HEADER = 'HEADER',
    MOVE_NUMBER = 'MOVE_NUMBER',
    MOVE = 'MOVE',
    NAG = 'NAG',
    COMMENT = 'COMMENT',
    VARIATION_START = 'VARIATION_START',
    VARIATION_END = 'VARIATION_END',
    RESULT = 'RESULT',
    EOF = 'EOF',
}

/**
 * Represents a single token from PGN text
 */
export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}

/**
 * Tokenizes PGN text into a stream of tokens.
 */
export class PGNTokenizer {
    private input: string;
    private position: number = 0;
    private line: number = 1;
    private column: number = 1;

    constructor(input: string) {
        this.input = input;
    }

    /**
     * Returns all tokens from the input.
     */
    tokenize(): Token[] {
        const tokens: Token[] = [];
        let token: Token;

        while ((token = this.nextToken()).type !== TokenType.EOF) {
            tokens.push(token);
        }

        tokens.push(token); // Add EOF token
        return tokens;
    }

    /**
     * Gets the next token from the input.
     */
    private nextToken(): Token {
        this.skipWhitespace();

        if (this.position >= this.input.length) {
            return this.createToken(TokenType.EOF, '');
        }

        const char = this.input[this.position];

        // Header: [Key "Value"]
        if (char === '[') {
            return this.readHeader();
        }

        // Comment: {text} or ; line comment
        if (char === '{') {
            return this.readBraceComment();
        }

        if (char === ';') {
            return this.readLineComment();
        }

        // Variation markers
        if (char === '(') {
            return this.createToken(TokenType.VARIATION_START, this.advance());
        }

        if (char === ')') {
            return this.createToken(TokenType.VARIATION_END, this.advance());
        }

        // NAG: $1, $2, etc.
        if (char === '$') {
            return this.readNAG();
        }

        // Result: 1-0, 0-1, 1/2-1/2, *
        if (this.isResultStart()) {
            return this.readResult();
        }

        // Move number: 1. or 1...
        if (this.isDigit(char)) {
            return this.readMoveNumber();
        }

        // Move in SAN notation
        if (this.isMoveStart(char)) {
            return this.readMove();
        }

        // Unknown character, skip it
        this.advance();
        return this.nextToken();
    }

    private readHeader(): Token {
        this.advance(); // skip '['

        let value = '[';
        let inQuotes = false;

        while (this.position < this.input.length) {
            const char = this.current();

            if (char === '"') {
                inQuotes = !inQuotes;
            }

            if (char === ']' && !inQuotes) {
                value += this.advance();
                break;
            }

            value += this.advance();
        }

        return this.createToken(TokenType.HEADER, value);
    }

    private readBraceComment(): Token {
        this.advance(); // skip '{'
        let value = '';

        while (this.position < this.input.length && this.current() !== '}') {
            value += this.advance();
        }

        if (this.current() === '}') {
            this.advance(); // skip '}'
        }

        return this.createToken(TokenType.COMMENT, value.trim());
    }

    private readLineComment(): Token {
        this.advance(); // skip ';'
        let value = '';

        while (this.position < this.input.length && this.current() !== '\n') {
            value += this.advance();
        }

        return this.createToken(TokenType.COMMENT, value.trim());
    }

    private readNAG(): Token {
        this.advance(); // skip '$'
        let value = '$';

        while (this.position < this.input.length && this.isDigit(this.current())) {
            value += this.advance();
        }

        return this.createToken(TokenType.NAG, value);
    }

    private readResult(): Token {
        let value = '';

        // Match: 1-0, 0-1, 1/2-1/2, or *
        if (this.current() === '*') {
            value = this.advance();
        } else {
            while (
                this.position < this.input.length &&
                /[01\-\/]/.test(this.current())
            ) {
                value += this.advance();
            }
        }

        return this.createToken(TokenType.RESULT, value);
    }

    private readMoveNumber(): Token {
        let value = '';

        while (this.position < this.input.length && this.isDigit(this.current())) {
            value += this.advance();
        }

        // Skip dots: 1. or 1...
        while (this.current() === '.') {
            value += this.advance();
        }

        return this.createToken(TokenType.MOVE_NUMBER, value);
    }

    private readMove(): Token {
        let value = '';

        // Read SAN move: e4, Nf3, O-O, exd5, etc.
        while (
            this.position < this.input.length &&
            this.isMoveChar(this.current())
        ) {
            value += this.advance();
        }

        return this.createToken(TokenType.MOVE, value);
    }

    private isMoveStart(char: string): boolean {
        return /[NBRQK]/.test(char) || /[a-h]/.test(char) || char === 'O';
    }

    private isMoveChar(char: string): boolean {
        return (
            /[a-h1-8NBRQKO\-+=x#]/.test(char) ||
            char === '+' ||
            char === '#' ||
            char === '!'
        );
    }

    private isResultStart(): boolean {
        const remaining = this.input.slice(this.position);
        return (
            remaining.startsWith('1-0') ||
            remaining.startsWith('0-1') ||
            remaining.startsWith('1/2-1/2') ||
            remaining.startsWith('*')
        );
    }

    private isDigit(char: string): boolean {
        return /[0-9]/.test(char);
    }

    private skipWhitespace(): void {
        while (
            this.position < this.input.length &&
            /\s/.test(this.current())
        ) {
            this.advance();
        }
    }

    private current(): string {
        return this.input[this.position];
    }

    private advance(): string {
        const char = this.input[this.position];
        this.position++;

        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }

        return char;
    }

    private createToken(type: TokenType, value: string): Token {
        return {
            type,
            value,
            line: this.line,
            column: this.column,
        };
    }
}
