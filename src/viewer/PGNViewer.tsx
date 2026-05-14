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
 * Recursively renders the move tree.
 * Groups Mainline moves into rows (White + Black).
 * Variations are rendered in nested blocks.
 */
function renderMoveTree(
    parentNode: MoveNode,
    currentNodeId: string,
    onMoveClick: (node: MoveNode) => void,
    depth: number
): React.ReactNode {
    const elements: React.ReactNode[] = [];
    let currentNode: MoveNode | undefined = parentNode.next;

    // Helper to render a single move node
    const renderMoveNode = (node: MoveNode, showMoveNumber: boolean, isBlackStub: boolean = false) => {
        const isCurrentMove = node.id === currentNodeId;
        const nags = node.nags.map(nagToSymbol).join('');

        const nodeElements: React.ReactNode[] = [];

        // Comment before
        if (node.commentBefore) {
            nodeElements.push(
                <span key={`comment-before-${node.id}`} className="pgn-comment">
                    {`{${node.commentBefore}}`}
                </span>
            );
        }

        // Move Number
        if (showMoveNumber) {
            nodeElements.push(
                <span key={`move-num-${node.id}`} className="pgn-move-number">
                    {node.moveNumber}{isBlackStub ? '...' : '.'}
                </span>
            );
        }

        // The Move
        nodeElements.push(
            <span
                key={node.id}
                className={`pgn-move ${isCurrentMove ? 'pgn-active' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onMoveClick(node);
                }}
            >
                {node.san}
                {nags && <span className="pgn-nag">{nags}</span>}
            </span>
        );

        // Comment after
        if (node.commentAfter) {
            nodeElements.push(
                <span key={`comment-after-${node.id}`} className="pgn-comment">
                    {`{${node.commentAfter}}`}
                </span>
            );
        }

        // Annotations (clock, eval)
        const annotations: string[] = [];
        if (node.clock !== undefined) {
            const hours = Math.floor(node.clock / 3600);
            const minutes = Math.floor((node.clock % 3600) / 60);
            const seconds = node.clock % 60;
            annotations.push(`clk ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
        if (node.eval !== undefined) {
            annotations.push(`eval ${node.eval > 0 ? '+' : ''}${node.eval.toFixed(2)}`);
        }

        if (annotations.length > 0) {
            nodeElements.push(
                <span key={`annotations-${node.id}`} className="pgn-annotation">
                    [{annotations.join(', ')}]
                </span>
            );
        }

        return nodeElements;
    };

    while (currentNode) {
        const whiteMove = currentNode.color === 'w' ? currentNode : null;
        const blackMove = whiteMove && whiteMove.next && whiteMove.next.color === 'b' ? whiteMove.next : (currentNode.color === 'b' ? currentNode : null);

        // If we have a white move (standard start of row)
        if (whiteMove) {
            const rowContent: React.ReactNode[] = [];

            // Render White
            rowContent.push(...renderMoveNode(whiteMove, true));

            // Render Black (if part of this pair)
            if (blackMove && blackMove !== currentNode) { // blackMove exists and follows white
                rowContent.push(...renderMoveNode(blackMove, false));
            }

            elements.push(
                <div key={`row-${whiteMove.id}`} className="pgn-row">
                    {rowContent}
                </div>
            );

            // Handle Variations & Logic for Next Loop

            // Check for variations on White
            if (whiteMove.variations.length > 0) {
                whiteMove.variations.forEach((v, i) => {
                    elements.push(
                        <div key={`var-w-${whiteMove.id}-${i}`} className="pgn-variation" style={{ marginLeft: (depth + 1) * 20 }}>
                            ({renderMoveTree({ ...whiteMove, next: v }, currentNodeId, onMoveClick, depth + 1)})
                        </div>
                    );
                });
            }

            // Check for variations on Black (if we processed it)
            if (blackMove && blackMove !== currentNode) {
                if (blackMove.variations.length > 0) {
                    blackMove.variations.forEach((v, i) => {
                        elements.push(
                            <div key={`var-b-${blackMove.id}-${i}`} className="pgn-variation" style={{ marginLeft: (depth + 1) * 20 }}>
                                ({renderMoveTree({ ...blackMove, next: v }, currentNodeId, onMoveClick, depth + 1)})
                            </div>
                        );
                    });
                }
                currentNode = blackMove.next;
            } else {
                // No black move followed, or we are at end of this line
                currentNode = whiteMove.next;
            }

        } else if (blackMove) {
            // We started with Black (e.g. 1... d5 variation or start from position)
            // Render just the black move in a row
            elements.push(
                <div key={`row-${blackMove.id}`} className="pgn-row">
                    {renderMoveNode(blackMove, true, true)}
                </div>
            );

            if (blackMove.variations.length > 0) {
                blackMove.variations.forEach((v, i) => {
                    elements.push(
                        <div key={`var-b-${blackMove.id}-${i}`} className="pgn-variation" style={{ marginLeft: (depth + 1) * 20 }}>
                            ({renderMoveTree({ ...blackMove, next: v }, currentNodeId, onMoveClick, depth + 1)})
                        </div>
                    );
                });
            }

            currentNode = blackMove.next;
        }
    }

    return <>{elements}</>;
}

