import React from 'react';
import { useSelector } from 'react-redux';

const GameInfo = () => {
  const { score, linesCleared } = useSelector(state => state.game);
  
  return (
    <div className="game-info">
      <h3>Game Info</h3>
      <div>
        <div className="info-item">
          <span className="info-label">Score:</span>
          <span className="info-value">{score}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Lines:</span>
          <span className="info-value">{linesCleared}</span>
        </div>
      </div>
      
      <div className="controls-info mt-1">
        <h4>Controls</h4>
        <div>
          <div>← Move Left</div>
          <div>→ Move Right</div>
          <div>↓ Move Down</div>
          <div>↑ Rotate</div>
          <div>Space Hard Drop</div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;