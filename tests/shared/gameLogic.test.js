import { createEmptyBoard, isValidPosition, rotatePiece, addPieceToBoard, clearLines, addPenaltyLines, computeSpectrum, isGameOver, calculateDropPosition, hardDrop } from '../../src/shared/functions/gameLogic';
  
  import { TETRIMINOS } from '../../src/shared/constants/tetriminos';
  
  describe('Game Logic Functions', () => {
    describe('createEmptyBoard', () => {
      it('should create a 20x10 empty board', () => {
        const board = createEmptyBoard();
        expect(board.length).toBe(20);
        expect(board[0].length).toBe(10);
        expect(board.every(row => row.every(cell => cell === 0))).toBe(true);
      });
    });
  
    describe('isValidPosition', () => {
      it('should return true for a valid position', () => {
        const board = createEmptyBoard();
        const piece = TETRIMINOS.I.shape[0];
        const result = isValidPosition(board, piece, 3, 0);
        expect(result).toBe(true);
      });
  
      it('should return false when piece is out of bounds on the left', () => {
        const board = createEmptyBoard();
        const piece = TETRIMINOS.I.shape[0];
        const result = isValidPosition(board, piece, -1, 0);
        expect(result).toBe(false);
      });
  
      it('should return false when piece is out of bounds on the right', () => {
        const board = createEmptyBoard();
        const piece = TETRIMINOS.I.shape[0];
        const result = isValidPosition(board, piece, 8, 0);
        expect(result).toBe(false);
      });
  
      it('should return false when piece is out of bounds on the bottom', () => {
        const board = createEmptyBoard();
        const piece = TETRIMINOS.I.shape[0];
        const result = isValidPosition(board, piece, 3, 20);
        expect(result).toBe(false);
      });
  
      it('should return false when piece collides with existing pieces', () => {
        let board = createEmptyBoard();
        board[19][5] = 'I'; // Add a piece at the bottom
        const piece = TETRIMINOS.I.shape[0];
        const result = isValidPosition(board, piece, 3, 19);
        expect(result).toBe(false);
      });
    });
  
    describe('rotatePiece', () => {
      it('should rotate a piece clockwise', () => {
        const type = 'I';
        const currentRotation = 0;
        const { rotation, shape } = rotatePiece(type, currentRotation);
        expect(rotation).toBe(1);
        expect(shape).toEqual(TETRIMINOS.I.shape[1]);
      });
  
      it('should wrap around to the first rotation when reaching the end', () => {
        const type = 'I';
        const currentRotation = 3;
        const { rotation, shape } = rotatePiece(type, currentRotation);
        expect(rotation).toBe(0);
        expect(shape).toEqual(TETRIMINOS.I.shape[0]);
      });
    });
  
    describe('addPieceToBoard', () => {
      it('should add a piece to the board', () => {
        const board = createEmptyBoard();
        const piece = TETRIMINOS.O.shape[0];
        const newBoard = addPieceToBoard(board, piece, 4, 0, 'O');
        
        // Check if the O piece was added correctly
        expect(newBoard[1][4]).toBe('O');
        expect(newBoard[1][5]).toBe('O');
        expect(newBoard[2][4]).toBe('O');
        expect(newBoard[2][5]).toBe('O');
      });
  
      it('should not modify the original board', () => {
        const board = createEmptyBoard();
        const originalBoard = JSON.parse(JSON.stringify(board));
        const piece = TETRIMINOS.O.shape[0];
        
        addPieceToBoard(board, piece, 4, 0, 'O');
        
        // Original board should remain unchanged
        expect(board).toEqual(originalBoard);
      });
    });
  
    describe('clearLines', () => {
      it('should clear completed lines', () => {
        let board = createEmptyBoard();
        
        // Fill a line completely
        board[19] = Array(10).fill('I');
        
        const { board: newBoard, clearedLines } = clearLines(board);
        
        expect(clearedLines).toBe(1);
        expect(newBoard[19].every(cell => cell === 0)).toBe(true);
      });
  
      it('should return the original board if no lines are completed', () => {
        const board = createEmptyBoard();
        const { board: newBoard, clearedLines } = clearLines(board);
        
        expect(clearedLines).toBe(0);
        expect(newBoard).toEqual(board);
      });
  
      it('should handle multiple completed lines', () => {
        let board = createEmptyBoard();
        
        // Fill two lines completely
        board[18] = Array(10).fill('I');
        board[19] = Array(10).fill('I');
        
        const { board: newBoard, clearedLines } = clearLines(board);
        
        expect(clearedLines).toBe(2);
        expect(newBoard[18].every(cell => cell === 0)).toBe(true);
        expect(newBoard[19].every(cell => cell === 0)).toBe(true);
      });
    });
  
    describe('addPenaltyLines', () => {
      it('should add penalty lines at the bottom', () => {
        const board = createEmptyBoard();
        const numLines = 2;
        const newBoard = addPenaltyLines(board, numLines);
        
        // Check that the bottom rows are penalty lines
        expect(newBoard[18].some(cell => cell === 'penalty')).toBe(true);
        expect(newBoard[19].some(cell => cell === 'penalty')).toBe(true);
        
        // Each penalty line should have exactly one empty cell
        const emptyCount18 = newBoard[18].filter(cell => cell === 0).length;
        const emptyCount19 = newBoard[19].filter(cell => cell === 0).length;
        
        expect(emptyCount18).toBe(1);
        expect(emptyCount19).toBe(1);
      });
    });
  
    describe('computeSpectrum', () => {
      it('should compute the spectrum correctly', () => {
        let board = createEmptyBoard();
        
        // Add some pieces to the board
        board[15][0] = 'I';
        board[16][1] = 'I';
        board[17][2] = 'I';
        board[18][3] = 'I';
        board[19][4] = 'I';
        
        const spectrum = computeSpectrum(board);
        
        expect(spectrum[0]).toBe(15);
        expect(spectrum[1]).toBe(16);
        expect(spectrum[2]).toBe(17);
        expect(spectrum[3]).toBe(18);
        expect(spectrum[4]).toBe(19);
        expect(spectrum[5]).toBe(20); // Empty column
      });
    });
  
    describe('isGameOver', () => {
      it('should return false for a new game', () => {
        const board = createEmptyBoard();
        expect(isGameOver(board)).toBe(false);
      });
  
      it('should return true when pieces reach the top', () => {
        let board = createEmptyBoard();
        board[0][5] = 'I'; // Piece at the top
        
        expect(isGameOver(board)).toBe(true);
      });
    });
  
    describe('calculateDropPosition', () => {
      it('should calculate the correct drop position', () => {
        const board = createEmptyBoard();
        const piece = TETRIMINOS.I.shape[0];
        
        const dropY = calculateDropPosition(board, piece, 3, 0);
        
        // For an empty board, the I piece should drop to y=18
        expect(dropY).toBe(18);
      });
  
      it('should handle pieces already on the board', () => {
        let board = createEmptyBoard();
        
        // Add a piece at the bottom
        board[19][3] = 'O';
        board[19][4] = 'O';
        board[19][5] = 'O';
        board[19][6] = 'O';
        
        const piece = TETRIMINOS.I.shape[0];
        
        const dropY = calculateDropPosition(board, piece, 3, 0);
        
        // The I piece should drop to y=17
        expect(dropY).toBe(17);
      });
    });
  
    describe('hardDrop', () => {
      it('should drop the piece to the bottom and lock it', () => {
        const board = createEmptyBoard();
        const piece = TETRIMINOS.I.shape[0];
        
        const { board: newBoard, position, locked } = hardDrop(board, piece, 3, 0, 'I');
        
        expect(position).toEqual({ x: 3, y: 18 });
        expect(locked).toBe(true);
        
        // Check if the piece is at the bottom of the board
        expect(newBoard[18][3]).toBe('I');
        expect(newBoard[18][4]).toBe('I');
        expect(newBoard[18][5]).toBe('I');
        expect(newBoard[18][6]).toBe('I');
      });
    });
  });