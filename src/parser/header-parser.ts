/**
 * Parses PGN headers from header tokens.
 * Format: [Key "Value"]
 */
export function parseHeaders(headerTokens: string[]): Record<string, string> {
    const headers: Record<string, string> = {};

    for (const token of headerTokens) {
        const match = token.match(/\[(\w+)\s+"(.*)"\]/);
        if (match) {
            const [, key, value] = match;
            headers[key] = value;
        }
    }

    return headers;
}

/**
 * Parses a single header string.
 */
export function parseHeader(header: string): { key: string; value: string } | null {
    const match = header.match(/\[(\w+)\s+"(.*)"\]/);
    if (match) {
        const [, key, value] = match;
        return { key, value };
    }
    return null;
}
