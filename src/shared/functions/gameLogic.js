import { BOARD_WIDTH, BOARD_HEIGHT, TETRIMINOS } from '../constants/tetriminos.js';

/**
 * Creates an empty game board
 * @returns {Array<Array<number|null>>} Empty game board
 */
export const createEmptyBoard = () => {
  return Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
};

/**
 * Checks if a position is valid (within the board and not colliding with existing pieces)
 * @param {Array<Array<number|null>>} board - The game board
 * @param {Array<Array<number>>} piece - The tetrimino piece
 * @param {number} x - X position
 * @param {number} y - Y position
 * @returns {boolean} - True if the position is valid
 */
export const isValidPosition = (board, piece, x, y) => {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      // Skip empty cells in the piece
      if (!piece[row][col]) continue;
      
      const boardX = x + col;
      const boardY = y + row;
      
      // Check if the piece is out of bounds or collides with existing pieces
      if (
        boardX < 0 || 
        boardX >= BOARD_WIDTH || 
        boardY >= BOARD_HEIGHT || 
        (boardY >= 0 && board[boardY][boardX])
      ) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Rotates a piece clockwise
 * @param {string} type - Tetrimino type
 * @param {number} currentRotation - Current rotation index
 * @returns {Object} - New rotation index and rotated piece
 */
export const rotatePiece = (type, currentRotation) => {
  const tetrimino = TETRIMINOS[type];
  const newRotation = (currentRotation + 1) % tetrimino.shape.length;
  return {
    rotation: newRotation,
    shape: tetrimino.shape[newRotation],
  };
};

/**
 * Adds a piece to the board
 * @param {Array<Array<number|null>>} board - The game board
 * @param {Array<Array<number>>} piece - The tetrimino piece
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} type - Tetrimino type
 * @returns {Array<Array<number|null>>} - New board with the piece added
 */
export const addPieceToBoard = (board, piece, x, y, type) => {
  // Create a new board (immutability)
  const newBoard = board.map(row => [...row]);
  
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      // Only add cells where the piece has a value of 1
      if (piece[row][col]) {
        const boardY = y + row;
        // If the piece is above the board, don't add it
        if (boardY < 0) continue;
        
        // Set the type string (not the numeric value) for the cell
        newBoard[boardY][x + col] = type;
      }
    }
  }
  
  return newBoard;
};

/**
 * Checks and clears completed lines
 * @param {Array<Array<number|null>>} board - The game board
 * @returns {Object} - New board and number of lines cleared
 */
export const clearLines = board => {
  // Find completed lines
  const completedLineIndices = board.reduce((indices, row, index) => {
    if (row.every(cell => cell !== 0)) {
      indices.push(index);
    }
    return indices;
  }, []);
  
  // If no lines were completed, return the original board
  if (completedLineIndices.length === 0) {
    return { board, clearedLines: 0 };
  }
  
  // Create a new board without the completed lines
  let newBoard = board.filter((_, index) => !completedLineIndices.includes(index));
  
  // Add new empty lines at the top
  const emptyLines = Array(completedLineIndices.length)
    .fill()
    .map(() => Array(BOARD_WIDTH).fill(0));
  
  newBoard = [...emptyLines, ...newBoard];
  
  return {
    board: newBoard,
    clearedLines: completedLineIndices.length,
  };
};

/**
 * Adds penalty lines to the bottom of the board
 * @param {Array<Array<number|null>>} board - The game board
 * @param {number} numLines - Number of penalty lines to add
 * @returns {Array<Array<number|null>>} - New board with penalty lines
 */
export const addPenaltyLines = (board, numLines) => {
  // Create penalty lines (filled except for one random empty cell in each line)
  const penaltyLines = Array(numLines)
    .fill()
    .map(() => {
      const emptyCell = Math.floor(Math.random() * BOARD_WIDTH);
      return Array(BOARD_WIDTH).fill('penalty').map((cell, index) => 
        index === emptyCell ? 0 : cell
      );
    });
  
  // Remove lines from the top to make room for penalty lines
  const newBoard = board.slice(numLines);
  
  // Add penalty lines at the bottom
  return [...newBoard, ...penaltyLines];
};

/**
 * Computes a player's spectrum (column heights) for opponents to see
 * @param {Array<Array<number|null>>} board - The game board
 * @returns {Array<number>} - Array of column heights
 */
export const computeSpectrum = board => {
  const spectrum = Array(BOARD_WIDTH).fill(BOARD_HEIGHT);
  
  // For each column, find the highest filled cell
  for (let col = 0; col < BOARD_WIDTH; col++) {
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      if (board[row][col] !== 0) {
        spectrum[col] = row;
        break;
      }
    }
  }
  
  return spectrum;
};

/**
 * Generates a random tetrimino type
 * @returns {string} - Tetrimino type
 */
export const getRandomTetrimino = () => {
  const types = Object.keys(TETRIMINOS);
  return types[Math.floor(Math.random() * types.length)];
};

/**
 * Checks if the game is over (pieces stack up to the top)
 * @param {Array<Array<number|null>>} board - The game board
 * @returns {boolean} - True if the game is over
 */
export const isGameOver = board => {
  // If there are pieces in the top row, the game is over
  return board[0].some(cell => cell !== 0);
};

/**
 * Calculates the drop position for a piece (for preview)
 * @param {Array<Array<number|null>>} board - The game board
 * @param {Array<Array<number>>} piece - The tetrimino piece
 * @param {number} x - X position
 * @param {number} y - Y position
 * @returns {number} - The drop position (y-coordinate)
 */
export const calculateDropPosition = (board, piece, x, y) => {
  let dropY = y;
  
  while (isValidPosition(board, piece, x, dropY + 1)) {
    dropY++;
  }
  
  return dropY;
};

/**
 * Performs a hard drop (instantly moves piece to the drop position)
 * @param {Array<Array<number|null>>} board - The game board
 * @param {Array<Array<number>>} piece - The tetrimino piece
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} type - Tetrimino type
 * @returns {Object} - New board, new position, and game state
 */
export const hardDrop = (board, piece, x, y, type) => {
  const dropY = calculateDropPosition(board, piece, x, y);
  
  // Make sure we use the string type when adding pieces to the board
  const newBoard = addPieceToBoard(board, piece, x, dropY, type);
  const { board: boardAfterClear, clearedLines } = clearLines(newBoard);
  
  return {
    board: boardAfterClear,
    position: { x, y: dropY },
    clearedLines,
    locked: true,
  };
};