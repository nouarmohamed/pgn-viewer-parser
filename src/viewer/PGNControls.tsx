'use client';

import { useEffect, useCallback } from 'react';
import { GameCursor } from '../cursor/game-cursor.js';
import { FirstMoveIcon, PreviousMoveIcon, NextMoveIcon, LastMoveIcon } from '../assets/icons.js';
import './styles.css';

export interface PGNControlsProps {
    /** The game cursor to control */
    cursor: GameCursor;
    /** Callback when position changes */
    onPositionChange?: (cursor: GameCursor) => void;
    /** Enable keyboard controls (default: true) */
    enableKeyboard?: boolean;
    /** Custom class name */
    className?: string;
}

/**
 * Navigation controls for a chess game.
 */
export function PGNControls({
    cursor,
    onPositionChange,
    enableKeyboard = true,
    className = '',
}: PGNControlsProps) {
    const handleFirst = useCallback(() => {
        cursor.toStart();
        onPositionChange?.(cursor);
    }, [cursor, onPositionChange]);

    const handlePrev = useCallback(() => {
        cursor.prev();
        onPositionChange?.(cursor);
    }, [cursor, onPositionChange]);

    const handleNext = useCallback(() => {
        cursor.next();
        onPositionChange?.(cursor);
    }, [cursor, onPositionChange]);

    const handleLast = useCallback(() => {
        cursor.toEnd();
        onPositionChange?.(cursor);
    }, [cursor, onPositionChange]);

    // Keyboard controls
    useEffect(() => {
        if (!enableKeyboard) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    handleFirst();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    handleLast();
                }
            } else {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    handlePrev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    handleNext();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    cursor.exitVariation();
                    onPositionChange?.(cursor);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    cursor.enterVariation(0);
                    onPositionChange?.(cursor);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enableKeyboard, handleFirst, handlePrev, handleNext, handleLast, cursor, onPositionChange]);

    return (
        <div className={`pgn-controls ${className}`}>
            <button
                className="pgn-control-button"
                onClick={handleFirst}
                disabled={cursor.isAtStart()}
                title="First move (Ctrl+←)"
            >
                <FirstMoveIcon size={24} />
            </button>
            <button
                className="pgn-control-button"
                onClick={handlePrev}
                disabled={cursor.isAtStart()}
                title="Previous move (←)"
            >
                <PreviousMoveIcon size={24} />
            </button>
            <button
                className="pgn-control-button"
                onClick={handleNext}
                disabled={cursor.isAtEnd()}
                title="Next move (→)"
            >
                <NextMoveIcon size={24} />
            </button>
            <button
                className="pgn-control-button"
                onClick={handleLast}
                disabled={cursor.isAtEnd()}
                title="Last move (Ctrl+→)"
            >
                <LastMoveIcon size={24} />
            </button>
        </div>
    );
}
