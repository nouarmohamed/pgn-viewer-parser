/**
 * Maps NAG (Numeric Annotation Glyph) codes to their symbolic representations.
 */
export const NAG_SYMBOLS: Record<number, string> = {
    1: '!',    // Good move
    2: '?',    // Poor move
    3: '!!',   // Very good move
    4: '??',   // Very poor move
    5: '!?',   // Interesting move
    6: '?!',   // Questionable move
    7: '□',    // Forced move
    10: '=',   // Equal position
    13: '∞',   // Unclear position
    14: '⩲',   // White has slight advantage
    15: '⩱',   // Black has slight advantage
    16: '±',   // White has moderate advantage
    17: '∓',   // Black has moderate advantage
    18: '+−',  // White has decisive advantage
    19: '−+',  // Black has decisive advantage
    22: '⨀',   // Zugzwang
    32: '⟳',   // Development advantage
    36: '↑',   // Initiative
    40: '→',   // Attack
    132: '⇆',  // Counterplay
    138: '⊕',  // Time pressure
};

/**
 * Converts a NAG code to its symbolic representation.
 */
export function nagToSymbol(nag: number): string {
    return NAG_SYMBOLS[nag] || `$${nag}`;
}

/**
 * Converts an array of NAG codes to their symbolic representations.
 */
export function nagsToSymbols(nags: number[]): string[] {
    return nags.map(nagToSymbol);
}
