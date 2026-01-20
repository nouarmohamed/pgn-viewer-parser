import { MoveNode } from '../model/move-node.js';

/**
 * Cursor for navigating through a chess game tree.
 */
export class GameCursor {
    private _current: MoveNode;
    private _root: MoveNode;

    constructor(root: MoveNode) {
        this._root = root;
        this._current = root;
    }

    /**
     * Gets the current node.
     */
    get current(): MoveNode {
        return this._current;
    }

    /**
     * Gets the root node.
     */
    get root(): MoveNode {
        return this._root;
    }

    /**
     * Moves to the next node in the current line.
     * Returns the new current node, or null if at the end.
     */
    next(): MoveNode | null {
        if (this._current.next) {
            this._current = this._current.next;
            return this._current;
        }
        return null;
    }

    /**
     * Moves to the previous node.
     * Returns the new current node, or null if at the start.
     */
    prev(): MoveNode | null {
        if (this._current.parent) {
            this._current = this._current.parent;
            return this._current;
        }
        return null;
    }

    /**
     * Jumps to a specific node by ID.
     */
    goTo(nodeId: string): void {
        const node = this.findNodeById(this._root, nodeId);
        if (node) {
            this._current = node;
        } else {
            throw new Error(`Node with ID ${nodeId} not found`);
        }
    }

    /**
     * Enters a variation at the given index.
     * Returns the first node of the variation, or null if invalid index.
     */
    enterVariation(index: number): MoveNode | null {
        if (index >= 0 && index < this._current.variations.length) {
            this._current = this._current.variations[index];
            return this._current;
        }
        return null;
    }

    /**
     * Exits the current variation and returns to the parent line.
     * Returns the parent node, or null if already in the mainline.
     */
    exitVariation(): MoveNode | null {
        if (this._current.parent) {
            this._current = this._current.parent;
            return this._current;
        }
        return null;
    }

    /**
     * Goes to the start of the game (root node).
     */
    toStart(): void {
        this._current = this._root;
    }

    /**
     * Goes to the end of the current line.
     */
    toEnd(): void {
        while (this._current.next) {
            this._current = this._current.next;
        }
    }

    /**
     * Checks if the cursor is at the start.
     */
    isAtStart(): boolean {
        return this._current === this._root;
    }

    /**
     * Checks if the cursor is at the end of the current line.
     */
    isAtEnd(): boolean {
        return this._current.next === undefined;
    }

    /**
     * Gets the mainline path from root to current position.
     */
    getMainlinePath(): MoveNode[] {
        const path: MoveNode[] = [];
        let node: MoveNode | undefined = this._current;

        while (node) {
            path.unshift(node);
            node = node.parent;
        }

        return path;
    }

    /**
     * Recursively finds a node by ID.
     */
    private findNodeById(node: MoveNode, id: string): MoveNode | null {
        if (node.id === id) {
            return node;
        }

        // Search in mainline
        if (node.next) {
            const found = this.findNodeById(node.next, id);
            if (found) return found;
        }

        // Search in variations
        for (const variation of node.variations) {
            const found = this.findNodeById(variation, id);
            if (found) return found;
        }

        return null;
    }
}
