import { describe, it, expect } from 'vitest';
import { GameCursor } from '../../src/cursor/game-cursor';
import { createRootNode, MoveNode } from '../../src/model/move-node';

describe('GameCursor', () => {
    // Helper to create a simple game tree
    function createTestGame(): MoveNode {
        const root = createRootNode();

        const e4: MoveNode = {
            id: 'e4',
            ply: 0,
            moveNumber: 1,
            color: 'w',
            san: 'e4',
            nags: [],
            variations: [],
            parent: root,
        };

        const e5: MoveNode = {
            id: 'e5',
            ply: 1,
            moveNumber: 1,
            color: 'b',
            san: 'e5',
            nags: [],
            variations: [],
            parent: e4,
        };

        const nf3: MoveNode = {
            id: 'nf3',
            ply: 2,
            moveNumber: 2,
            color: 'w',
            san: 'Nf3',
            nags: [],
            variations: [],
            parent: e5,
        };

        // Variation: c5
        const c5: MoveNode = {
            id: 'c5',
            ply: 1,
            moveNumber: 1,
            color: 'b',
            san: 'c5',
            nags: [],
            variations: [],
            parent: e4,
        };

        root.next = e4;
        e4.next = e5;
        e4.variations = [c5];
        e5.next = nf3;

        return root;
    }

    it('should start at root', () => {
        const root = createTestGame();
        const cursor = new GameCursor(root);

        expect(cursor.current).toBe(root);
        expect(cursor.isAtStart()).toBe(true);
    });

    it('should move forward with next()', () => {
        const root = createTestGame();
        const cursor = new GameCursor(root);

        const e4 = cursor.next();
        expect(e4?.san).toBe('e4');

        const e5 = cursor.next();
        expect(e5?.san).toBe('e5');

        const nf3 = cursor.next();
        expect(nf3?.san).toBe('Nf3');

        expect(cursor.isAtEnd()).toBe(true);
    });

    it('should move backward with prev()', () => {
        const root = createTestGame();
        const cursor = new GameCursor(root);

        cursor.toEnd();
        expect(cursor.current.san).toBe('Nf3');

        cursor.prev();
        expect(cursor.current.san).toBe('e5');

        cursor.prev();
        expect(cursor.current.san).toBe('e4');

        cursor.prev();
        expect(cursor.isAtStart()).toBe(true);
    });

    it('should jump to a specific node with goTo()', () => {
        const root = createTestGame();
        const cursor = new GameCursor(root);

        cursor.goTo('e5');
        expect(cursor.current.san).toBe('e5');

        cursor.goTo('nf3');
        expect(cursor.current.san).toBe('Nf3');
    });

    it('should enter a variation', () => {
        const root = createTestGame();
        const cursor = new GameCursor(root);

        cursor.goTo('e4');
        const c5 = cursor.enterVariation(0);

        expect(c5?.san).toBe('c5');
        expect(cursor.current.san).toBe('c5');
    });

    it('should exit a variation', () => {
        const root = createTestGame();
        const cursor = new GameCursor(root);

        cursor.goTo('e4');
        cursor.enterVariation(0);
        expect(cursor.current.san).toBe('c5');

        cursor.exitVariation();
        expect(cursor.current.san).toBe('e4');
    });

    it('should go to start and end', () => {
        const root = createTestGame();
        const cursor = new GameCursor(root);

        cursor.toEnd();
        expect(cursor.current.san).toBe('Nf3');
        expect(cursor.isAtEnd()).toBe(true);

        cursor.toStart();
        expect(cursor.isAtStart()).toBe(true);
    });

    it('should get mainline path', () => {
        const root = createTestGame();
        const cursor = new GameCursor(root);

        cursor.goTo('e5');
        const path = cursor.getMainlinePath();

        expect(path.length).toBe(3);
        expect(path[0]).toBe(root);
        expect(path[1].san).toBe('e4');
        expect(path[2].san).toBe('e5');
    });
});
