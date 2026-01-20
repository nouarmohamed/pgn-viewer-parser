import { describe, it, expect } from 'vitest';
import {
    parseTimeAnnotation,
    parseEvalAnnotation,
    parseAnnotations,
} from '../../src/utils/annotation-parser';

describe('Annotation Parser', () => {
    describe('parseTimeAnnotation', () => {
        it('should parse clock time', () => {
            const comment = '[%clk 0:04:32]';
            const result = parseTimeAnnotation(comment);

            expect(result.clock).toBe(4 * 60 + 32); // 272 seconds
        });

        it('should parse EMT', () => {
            const comment = '[%emt 0:00:03]';
            const result = parseTimeAnnotation(comment);

            expect(result.emt).toBe(3);
        });

        it('should parse both clock and EMT', () => {
            const comment = '[%clk 0:04:32][%emt 0:00:03]';
            const result = parseTimeAnnotation(comment);

            expect(result.clock).toBe(272);
            expect(result.emt).toBe(3);
        });
    });

    describe('parseEvalAnnotation', () => {
        it('should parse positive evaluation', () => {
            const comment = '[%eval +0.35]';
            const result = parseEvalAnnotation(comment);

            expect(result.eval).toBe(0.35);
        });

        it('should parse negative evaluation', () => {
            const comment = '[%eval -1.2]';
            const result = parseEvalAnnotation(comment);

            expect(result.eval).toBe(-1.2);
        });

        it('should parse mate score', () => {
            const comment = '[%eval #3]';
            const result = parseEvalAnnotation(comment);

            expect(result.eval).toBe(10000);
        });

        it('should parse depth', () => {
            const comment = '[%depth 18]';
            const result = parseEvalAnnotation(comment);

            expect(result.depth).toBe(18);
        });
    });

    describe('parseAnnotations', () => {
        it('should parse all annotations and clean comment', () => {
            const comment =
                'Good move [%clk 0:04:32][%emt 0:00:03][%eval +0.35][%depth 18]';
            const result = parseAnnotations(comment);

            expect(result.clock).toBe(272);
            expect(result.emt).toBe(3);
            expect(result.eval).toBe(0.35);
            expect(result.depth).toBe(18);
            expect(result.cleanComment).toBe('Good move');
        });

        it('should handle comment with no annotations', () => {
            const comment = 'Just a regular comment';
            const result = parseAnnotations(comment);

            expect(result.cleanComment).toBe('Just a regular comment');
            expect(result.clock).toBeUndefined();
            expect(result.eval).toBeUndefined();
        });
    });
});
