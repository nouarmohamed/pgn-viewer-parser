import { describe, it, expect } from 'vitest';
import { parseHeader, parseHeaders } from '../../src/parser/header-parser';

describe('Header Parser', () => {
    it('should parse a single header', () => {
        const header = '[Event "Live Chess"]';
        const result = parseHeader(header);

        expect(result).toEqual({ key: 'Event', value: 'Live Chess' });
    });

    it('should parse multiple headers', () => {
        const headers = [
            '[Event "Live Chess"]',
            '[Site "Chess.com"]',
            '[Date "2024.01.15"]',
            '[White "Magnus Carlsen"]',
            '[Black "Hikaru Nakamura"]',
            '[Result "1-0"]',
        ];

        const result = parseHeaders(headers);

        expect(result).toEqual({
            Event: 'Live Chess',
            Site: 'Chess.com',
            Date: '2024.01.15',
            White: 'Magnus Carlsen',
            Black: 'Hikaru Nakamura',
            Result: '1-0',
        });
    });

    it('should handle headers with special characters', () => {
        const header = '[Event "World Championship (Round 5)"]';
        const result = parseHeader(header);

        expect(result).toEqual({
            key: 'Event',
            value: 'World Championship (Round 5)',
        });
    });

    it('should return null for malformed headers', () => {
        const header = 'Not a header';
        const result = parseHeader(header);

        expect(result).toBeNull();
    });
});
