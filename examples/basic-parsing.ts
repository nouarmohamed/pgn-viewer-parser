import { parsePGN, GameCursor } from '../src/index.js';

// Example PGN
const pgnText = `
[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.01.15"]
[White "Player 1"]
[Black "Player 2"]
[Result "1-0"]

1. e4 {King's pawn opening} e5 2. Nf3 Nc6 3. Bb5 {Ruy Lopez} a6 
(3... Nf6 {Berlin Defense} 4. O-O Nxe4) 
4. Ba4 Nf6 5. O-O 1-0
`;

// Parse the PGN
const game = parsePGN(pgnText);

console.log('=== PGN Parser Example ===\n');

// Display headers
console.log('Headers:');
Object.entries(game.headers).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
});

// Create a cursor for navigation
const cursor = new GameCursor(game.root);

console.log('\n=== Mainline Moves ===');
while (cursor.next()) {
    const node = cursor.current;
    console.log(
        `${node.moveNumber}${node.color === 'w' ? '.' : '...'} ${node.san}${node.commentAfter ? ` {${node.commentAfter}}` : ''
        }`
    );
}

// Reset to start
cursor.toStart();

console.log('\n=== Navigation Example ===');
cursor.next(); // e4
cursor.next(); // e5
cursor.next(); // Nf3
console.log(`Current position: ${cursor.current.san}`);

cursor.prev();
console.log(`After prev(): ${cursor.current.san}`);

cursor.toEnd();
console.log(`At end: ${cursor.current.san}`);

cursor.toStart();
console.log(`Back to start: ${cursor.isAtStart()}`);

// Explore variations
console.log('\n=== Variations Example ===');
cursor.goTo('node_5'); // Navigate to a6 (which has variations)

// Find the node with variations
let current = game.root.next;
while (current) {
    if (current.variations.length > 0) {
        console.log(`Move ${current.san} has ${current.variations.length} variation(s):`);
        current.variations.forEach((variation, index) => {
            console.log(`  Variation ${index + 1}: ${variation.san}`);
        });
        break;
    }
    current = current.next;
}
