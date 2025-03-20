import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendPlayerMove } from '../../socket';
import { isValidPosition } from '../../../shared/functions/gameLogic';

const GameBoard = () => {
  const { board, currentPiece } = useSelector(state => state.game);
  const { isGameOver } = useSelector(state => state.player);

  // Render the current piece on the board
  const renderBoard = useCallback(() => {
    // Create a copy of the board
    const displayBoard = board.map(row => [...row]);
    
    // Add the current piece to the display board
    if (currentPiece) {
      const { shape, x, y, type } = currentPiece;
      
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const boardY = y + row;
            const boardX = x + col;
            
            // Only show the piece if it's within the board
            if (
              boardY >= 0 && 
              boardY < displayBoard.length && 
              boardX >= 0 && 
              boardX < displayBoard[0].length
            ) {
              displayBoard[boardY][boardX] = type;
            }
          }
        }
      }
    }
    
    return displayBoard;
  }, [board, currentPiece]);

  // Handle keyboard controls
  const handleKeyDown = useCallback((e) => {
    if (isGameOver) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        sendPlayerMove('left');
        break;
      case 'ArrowRight':
        sendPlayerMove('right');
        break;
      case 'ArrowDown':
        sendPlayerMove('down');
        break;
      case 'ArrowUp':
        sendPlayerMove('rotate');
        break;
      case ' ':
        sendPlayerMove('drop');
        break;
      default:
        break;
    }
  }, [isGameOver]);

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Calculate the display board with current piece
  const displayBoard = renderBoard();

  return (
    <div className="game-board-container">
      <div className="game-board">
        {displayBoard.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`} 
              className={`cell ${cell ? `cell-${cell}` : 'cell-empty'}`}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default GameBoard;