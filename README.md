# PGN Viewer Parser

A production-ready TypeScript library for parsing and viewing chess PGN (Portable Game Notation) files. Designed for Next.js/React applications with full support for variations, comments, NAGs, and annotations.

## Features

✅ **Complete PGN Parsing** - Supports all official PGN features including variations, comments, NAGs, and annotations  
✅ **Tree Data Structure** - Represents games as a navigable tree with mainline and variations  
✅ **Pure TypeScript** - No chess.js dependency for parsing (optional for board state)  
✅ **React Components** - Optional viewer components with keyboard navigation  
✅ **Next.js Compatible** - Works with App Router (Server/Client components)  
✅ **Tree-Shakable** - Import only what you need  
✅ **Fully Typed** - Complete TypeScript type definitions  
✅ **Comprehensive Tests** - Extensive test coverage with Vitest

## Installation

```bash
npm install pgn-viewer-parser
```

For React components:
```bash
npm install pgn-viewer-parser react react-dom
```

## Quick Start

### Basic Parsing

```typescript
import { parsePGN, GameCursor } from 'pgn-viewer-parser';

const pgnText = `
[Event "Live Chess"]
[White "Magnus Carlsen"]
[Black "Hikaru Nakamura"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 1-0
`;

// Parse the PGN
const game = parsePGN(pgnText);

// Access headers
console.log(game.headers.Event); // "Live Chess"
console.log(game.headers.White); // "Magnus Carlsen"

// Navigate through moves
const cursor = new GameCursor(game.root);
cursor.next(); // e4
cursor.next(); // e5
console.log(cursor.current.san); // "e5"
```

### React Viewer

```tsx
'use client';

import { parsePGN, GameCursor } from 'pgn-viewer-parser';
import { PGNViewer, PGNControls } from 'pgn-viewer-parser/viewer';

export default function ChessGame() {
  const game = parsePGN(pgnText);
  const cursor = new GameCursor(game.root);

  return (
    <div>
      <PGNViewer root={game.root} cursor={cursor} />
      <PGNControls cursor={cursor} />
    </div>
  );
}
```

## API Reference

### Parsing

#### `parsePGN(pgnText: string): PGNGame`

Parses PGN text and returns a game object.

```typescript
const game = parsePGN(pgnText);
```

### Data Structures

#### `PGNGame`

```typescript
interface PGNGame {
  headers: Record<string, string>;  // PGN headers
  root: MoveNode;                   // Root of the game tree
}
```

#### `MoveNode`

```typescript
interface MoveNode {
  id: string;              // Unique identifier
  ply: number;             // Half-move number (0-indexed)
  moveNumber: number;      // Full move number
  color: 'w' | 'b';        // Side to move
  san: string;             // Move in SAN notation
  nags: number[];          // Numeric Annotation Glyphs
  commentBefore?: string;  // Comment before move
  commentAfter?: string;   // Comment after move
  clock?: number;          // Clock time (seconds)
  emt?: number;            // Elapsed move time (seconds)
  eval?: number;           // Position evaluation
  depth?: number;          // Search depth
  parent?: MoveNode;       // Parent node
  next?: MoveNode;         // Next move in mainline
  variations: MoveNode[];  // Alternative variations
}
```

### Navigation

#### `GameCursor`

```typescript
class GameCursor {
  current: MoveNode;       // Current position
  root: MoveNode;          // Game root

  next(): MoveNode | null;              // Move forward
  prev(): MoveNode | null;              // Move backward
  goTo(nodeId: string): void;           // Jump to node
  enterVariation(index: number): MoveNode | null;  // Enter variation
  exitVariation(): MoveNode | null;     // Exit variation
  toStart(): void;                      // Go to start
  toEnd(): void;                        // Go to end
  isAtStart(): boolean;                 // Check if at start
  isAtEnd(): boolean;                   // Check if at end
  getMainlinePath(): MoveNode[];        // Get path to current
}
```

### React Components

#### `<PGNViewer />`

Displays moves with variations and comments.

```tsx
<PGNViewer
  root={game.root}
  cursor={cursor}
  onMoveClick={(node) => console.log(node.san)}
  className="custom-class"
/>
```

**Props:**
- `root: MoveNode` - Root of the game tree
- `cursor?: GameCursor` - Optional cursor for external control
- `onMoveClick?: (node: MoveNode) => void` - Callback when move is clicked
- `className?: string` - Custom CSS class

#### `<PGNControls />`

Navigation controls with keyboard support.

```tsx
<PGNControls
  cursor={cursor}
  onPositionChange={(cursor) => forceUpdate()}
  enableKeyboard={true}
/>
```

**Props:**
- `cursor: GameCursor` - The cursor to control
- `onPositionChange?: (cursor: GameCursor) => void` - Callback on position change
- `enableKeyboard?: boolean` - Enable keyboard controls (default: true)
- `className?: string` - Custom CSS class

**Keyboard Shortcuts:**
- `←` Previous move
- `→` Next move
- `↑` Exit variation
- `↓` Enter first variation
- `Ctrl+←` First move
- `Ctrl+→` Last move

## Advanced Features

### Parsing Variations

```typescript
const pgn = `
1. e4 e5 (1... c5 2. Nf3) 2. Nf3
`;

const game = parsePGN(pgn);
const e4 = game.root.next;
const e5 = e4.next;

// Access variation
const c5 = e5.variations[0];
console.log(c5.san); // "c5"
```

### Parsing Annotations

```typescript
const pgn = `
1. e4 e5 {[%clk 0:04:32][%eval +0.35][%depth 18]}
`;

const game = parsePGN(pgn);
const e5 = game.root.next.next;

console.log(e5.clock);  // 272 (seconds)
console.log(e5.eval);   // 0.35
console.log(e5.depth);  // 18
```

### NAG Symbols

```typescript
import { nagToSymbol } from 'pgn-viewer-parser';

console.log(nagToSymbol(1));  // "!"  (good move)
console.log(nagToSymbol(2));  // "?"  (poor move)
console.log(nagToSymbol(3));  // "!!" (brilliant move)
```

## Next.js Integration

### App Router (Recommended)

```tsx
// app/game/page.tsx
'use client';

import { parsePGN, GameCursor } from 'pgn-viewer-parser';
import { PGNViewer, PGNControls } from 'pgn-viewer-parser/viewer';

export default function GamePage() {
  // Your component code
}
```

### Server Component

```tsx
// app/game/page.tsx
import { parsePGN } from 'pgn-viewer-parser';

export default function GamePage() {
  const game = parsePGN(pgnText);
  
  return (
    <div>
      <h1>{game.headers.Event}</h1>
      {/* Render game info */}
    </div>
  );
}
```

## Comparison with chess.js

| Feature | pgn-viewer-parser | chess.js |
|---------|------------------|----------|
| PGN Parsing | ✅ Full support | ⚠️ Mainline only |
| Variations | ✅ Tree structure | ❌ Not supported |
| Comments | ✅ Before/after | ⚠️ Limited |
| NAGs | ✅ Full support | ❌ Not supported |
| Annotations | ✅ Clock/eval/depth | ❌ Not supported |
| Board State | ⚠️ Optional | ✅ Built-in |
| Move Validation | ⚠️ Optional | ✅ Built-in |
| React Components | ✅ Included | ❌ Not included |

**Use pgn-viewer-parser when:**
- You need to parse PGN with variations
- You want to display games with a tree structure
- You need annotations and comments
- You're building a PGN viewer/analyzer

**Use chess.js when:**
- You need move validation
- You're building a playable chess board
- You don't need variation support

**Use both together:**
```typescript
import { parsePGN } from 'pgn-viewer-parser';
import { Chess } from 'chess.js';

const game = parsePGN(pgnText);
const chess = new Chess();

// Apply moves to chess.js for board state
let node = game.root.next;
while (node) {
  chess.move(node.san);
  node = node.next;
}
```

## Examples

See the `examples/` directory for complete examples:
- `basic-parsing.ts` - Basic parsing and navigation
- `react-viewer.tsx` - React component usage

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build library
npm run build

# Type check
npm run type-check
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or PR.

## Support

For issues and questions, please open an issue on GitHub.
