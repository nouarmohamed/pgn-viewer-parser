/**
 * Parses time annotations from comments.
 * Supports: [%clk 0:04:32], [%emt 0:00:03]
 */
export function parseTimeAnnotation(comment: string): {
    clock?: number;
    emt?: number;
} {
    const result: { clock?: number; emt?: number } = {};

    // Parse clock: [%clk 0:04:32]
    const clockMatch = comment.match(/\[%clk\s+(\d+):(\d+):(\d+)\]/);
    if (clockMatch) {
        const [, hours, minutes, seconds] = clockMatch;
        result.clock =
            parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    }

    // Parse EMT: [%emt 0:00:03]
    const emtMatch = comment.match(/\[%emt\s+(\d+):(\d+):(\d+)\]/);
    if (emtMatch) {
        const [, hours, minutes, seconds] = emtMatch;
        result.emt =
            parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    }

    return result;
}

/**
 * Parses evaluation annotation from comments.
 * Supports: [%eval +0.35], [%eval -1.2], [%eval #3]
 */
export function parseEvalAnnotation(comment: string): {
    eval?: number;
    depth?: number;
} {
    const result: { eval?: number; depth?: number } = {};

    // Parse eval: [%eval +0.35] or [%eval #3]
    const evalMatch = comment.match(/\[%eval\s+([\+\-]?\d+\.?\d*|#[\+\-]?\d+)\]/);
    if (evalMatch) {
        const evalStr = evalMatch[1];
        if (evalStr.startsWith('#')) {
            // Mate score: convert to large number
            const mateIn = parseInt(evalStr.slice(1));
            result.eval = mateIn > 0 ? 10000 : -10000;
        } else {
            result.eval = parseFloat(evalStr);
        }
    }

    // Parse depth: [%depth 18]
    const depthMatch = comment.match(/\[%depth\s+(\d+)\]/);
    if (depthMatch) {
        result.depth = parseInt(depthMatch[1]);
    }

    return result;
}

/**
 * Parses all annotations from a comment string.
 */
export function parseAnnotations(comment: string): {
    clock?: number;
    emt?: number;
    eval?: number;
    depth?: number;
    cleanComment: string;
} {
    const timeData = parseTimeAnnotation(comment);
    const evalData = parseEvalAnnotation(comment);

    // Remove annotations from comment
    const cleanComment = comment
        .replace(/\[%clk\s+\d+:\d+:\d+\]/g, '')
        .replace(/\[%emt\s+\d+:\d+:\d+\]/g, '')
        .replace(/\[%eval\s+[\+\-]?\d+\.?\d*\]/g, '')
        .replace(/\[%eval\s+#[\+\-]?\d+\]/g, '')
        .replace(/\[%depth\s+\d+\]/g, '')
        .trim();

    return {
        ...timeData,
        ...evalData,
        cleanComment,
    };
}
