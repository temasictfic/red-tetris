# Red Tetris

A multiplayer Tetris game built with React, Redux, Socket.io, and Node.js.

## Features

- Real-time multiplayer Tetris gameplay
- Penalty system: clear lines to send penalties to opponents
- Spectrums to visualize opponent's boards
- Game rooms with leader controls
- Ready/not ready system
- Responsive design using CSS Grid and Flexbox

## Technologies

### Backend
- Node.js
- Express
- Socket.io
- Jest (testing)

### Frontend
- React (functional components with hooks)
- Redux Toolkit (state management)
- React Router (URL routing)
- Socket.io-client
- CSS Grid/Flexbox

## Installation

1. Clone the repository:
```bash
git clone https://github.com/temasictfic/red-tetris.git
cd red-tetris
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file (see .env.example for reference)

4. Run development server and client:
```bash
npm run dev:server
npm run dev:client
```

## Project Structure

- `src/`
  - `client/`: Frontend React application
    - `assets/`: Static assets and styles
    - `components/`: React components
    - `pages/`: Page components
    - `redux/`: Redux store and slices
    - `socket/`: Socket.io client setup
    - `utils/`: Utility functions
  - `server/`: Backend Node.js application
    - `classes/`: Game, Player, and Piece classes
    - `socket/`: Socket.io event handlers
  - `shared/`: Code shared between client and server
    - `constants/`: Game constants
    - `functions/`: Pure functions for game logic

## How to Play

1. Enter a room ID and player name on the home page
2. Click "Join Game"
3. Set your status to "Ready"
4. The room leader can start the game when all players are ready
5. Use arrow keys to move and rotate the pieces:
   - Left Arrow: Move Left
   - Right Arrow: Move Right
   - Down Arrow: Move Down
   - Up Arrow: Rotate
   - Spacebar: Hard Drop
6. Clear lines to send penalties to opponents
7. Last player standing wins!

## Game Rules

- Each player has their own 10x20 playfield
- All players receive the same sequence of pieces
- Clearing 2 or more lines sends n-1 penalty lines to opponents
- Penalty lines appear at the bottom with one random gap
- Game ends when a player can't place a new piece
- The last player remaining wins

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## License

MIT License