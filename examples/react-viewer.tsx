'use client';

import React, { useState } from 'react';
import { parsePGN, GameCursor } from 'pgn-viewer-parser';
import { PGNViewer, PGNControls } from 'pgn-viewer-parser/viewer';

const examplePGN = `
[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.01.15"]
[White "Magnus Carlsen"]
[Black "Hikaru Nakamura"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 {Ruy Lopez} a6 
(3... Nf6 {Berlin Defense} 4. O-O Nxe4) 
4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 1-0
`;

export default function PGNViewerExample() {
    const [game] = useState(() => parsePGN(examplePGN));
    const [cursor] = useState(() => new GameCursor(game.root));
    const [, forceUpdate] = useState({});

    const handlePositionChange = () => {
        forceUpdate({});
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>PGN Viewer Example</h1>

            <div style={{ marginBottom: '20px' }}>
                <h2>Game Information</h2>
                <p>
                    <strong>Event:</strong> {game.headers.Event}
                </p>
                <p>
                    <strong>White:</strong> {game.headers.White}
                </p>
                <p>
                    <strong>Black:</strong> {game.headers.Black}
                </p>
                <p>
                    <strong>Result:</strong> {game.headers.Result}
                </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Moves</h2>
                <PGNViewer
                    root={game.root}
                    cursor={cursor}
                    onMoveClick={handlePositionChange}
                />
            </div>

            <div>
                <h2>Controls</h2>
                <PGNControls cursor={cursor} onPositionChange={handlePositionChange} />
                <p style={{ marginTop: '10px', color: '#666' }}>
                    Use arrow keys: ← → to navigate, ↑ to exit variation, ↓ to enter
                    variation
                </p>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Current Position</h3>
                <p>
                    {cursor.current.san
                        ? `${cursor.current.moveNumber}${cursor.current.color === 'w' ? '.' : '...'
                        } ${cursor.current.san}`
                        : 'Starting position'}
                </p>
            </div>
        </div>
    );
}
