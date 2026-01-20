'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MoveNode } from '../model/move-node.js';
import { GameCursor } from '../cursor/game-cursor.js';
import { nagToSymbol } from '../utils/nag-symbols.js';
import './styles.css';

export interface PGNViewerProps {
    /** The root node of the game tree */
    root: MoveNode;
    /** Optional cursor for external control */
    cursor?: GameCursor;
    /** Callback when a move is clicked */
    onMoveClick?: (node: MoveNode) => void;
    /** Custom class name */
    className?: string;
}

/**
 * Displays a chess game in PGN notation with support for variations.
 */
export function PGNViewer({
    root,
    cursor: externalCursor,
    onMoveClick,
    className = '',
}: PGNViewerProps) {
    const [internalCursor] = useState(() => new GameCursor(root));
    const cursor = externalCursor || internalCursor;
    const [currentNodeId, setCurrentNodeId] = useState(cursor.current.id);

    // Update when cursor changes
    useEffect(() => {
        setCurrentNodeId(cursor.current.id);
    }, [cursor.current.id]);

    const handleMoveClick = useCallback(
        (node: MoveNode) => {
            cursor.goTo(node.id);
            setCurrentNodeId(node.id);
            onMoveClick?.(node);
        },
        [cursor, onMoveClick]
    );

    return (
        <div className={`pgn-viewer ${className}`}>
            {renderMoveTree(root, currentNodeId, handleMoveClick, 0)}
        </div>
    );
}

/**
 * Recursively renders the move tree with proper indentation for variations.
 */
function renderMoveTree(
    node: MoveNode,
    currentNodeId: string,
    onMoveClick: (node: MoveNode) => void,
    depth: number
): React.ReactNode {
    const elements: React.ReactNode[] = [];
    let currentNode: MoveNode | undefined = node.next;
    let moveIndex = 0;

    while (currentNode) {
        const isCurrentMove = currentNode.id === currentNodeId;
        const showMoveNumber = currentNode.color === 'w';

        // Comment before move
        if (currentNode.commentBefore) {
            elements.push(
                <span key={`comment-before-${currentNode.id}`} className="pgn-comment">
                    {`{${currentNode.commentBefore}}`}
                </span>
            );
        }

        // Move number for white moves
        if (showMoveNumber) {
            elements.push(
                <span key={`move-num-${currentNode.id}`} className="pgn-move-number">
                    {currentNode.moveNumber}.
                </span>
            );
        }

        // The move itself
        const nags = currentNode.nags.map(nagToSymbol).join('');
        elements.push(
            <span
                key={currentNode.id}
                className={`pgn-move ${isCurrentMove ? 'pgn-move-current' : ''}`}
                onClick={() => onMoveClick(currentNode!)}
                style={{ cursor: 'pointer' }}
            >
                {currentNode.san}
                {nags && <span className="pgn-nag">{nags}</span>}
            </span>
        );

        // Comment after move
        if (currentNode.commentAfter) {
            elements.push(
                <span key={`comment-after-${currentNode.id}`} className="pgn-comment">
                    {`{${currentNode.commentAfter}}`}
                </span>
            );
        }

        // Annotations (clock, eval)
        const annotations: string[] = [];
        if (currentNode.clock !== undefined) {
            const hours = Math.floor(currentNode.clock / 3600);
            const minutes = Math.floor((currentNode.clock % 3600) / 60);
            const seconds = currentNode.clock % 60;
            annotations.push(`clk ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
        if (currentNode.eval !== undefined) {
            annotations.push(`eval ${currentNode.eval > 0 ? '+' : ''}${currentNode.eval.toFixed(2)}`);
        }

        if (annotations.length > 0) {
            elements.push(
                <span key={`annotations-${currentNode.id}`} className="pgn-annotation">
                    [{annotations.join(', ')}]
                </span>
            );
        }

        // Variations
        if (currentNode.variations.length > 0) {
            currentNode.variations.forEach((variation, index) => {
                elements.push(
                    <div
                        key={`variation-${currentNode!.id}-${index}`}
                        className="pgn-variation"
                        style={{ marginLeft: `${(depth + 1) * 20}px` }}
                    >
                        (
                        {renderMoveTree(
                            { ...currentNode!, next: variation },
                            currentNodeId,
                            onMoveClick,
                            depth + 1
                        )}
                        )
                    </div>
                );
            });
        }

        currentNode = currentNode.next;
        moveIndex++;
    }

    return <>{elements}</>;
}
