import React from 'react';
import { useSelector } from 'react-redux';

const NextPiece = () => {
  const { nextPiece } = useSelector(state => state.game);
  
  if (!nextPiece) {
    return (
      <div className="next-piece-container">
        <h3>Next Piece</h3>
        <div className="next-piece">
          {Array(4).fill().map((_, rowIndex) => (
            Array(4).fill().map((_, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                className="cell cell-empty"
              />
            ))
          ))}
        </div>
      </div>
    );
  }
  
  // Create a 4x4 display grid for the next piece
  const displayGrid = Array(4).fill().map(() => Array(4).fill(0));
  
  // Center the piece in the display grid
  const { shape, type } = nextPiece;
  const offsetX = Math.floor((4 - shape[0].length) / 2);
  const offsetY = Math.floor((4 - shape.length) / 2);
  
  // Place the piece in the display grid
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        displayGrid[row + offsetY][col + offsetX] = type;
      }
    }
  }
  
  return (
    <div className="next-piece-container">
      <h3>Next Piece</h3>
      <div className="next-piece">
        {displayGrid.map((row, rowIndex) => (
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

export default NextPiece;