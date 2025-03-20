import React from 'react';

const GameOverModal = ({ winner, isWinner, onClose, onBackToLobby }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Game Over</h2>
        
        {winner ? (
          <div className="mb-2">
            <p className="mb-1">Winner: {winner.name}</p>
            {isWinner ? (
              <p className="player-ready">Congratulations! You won!</p>
            ) : (
              <p className="player-not-ready">Better luck next time!</p>
            )}
          </div>
        ) : (
          <p className="mb-2">No winner</p>
        )}
        
        <div className="flex justify-center" style={{ gap: '10px' }}>
          <button onClick={onClose}>Close</button>
          <button onClick={onBackToLobby}>Back to Lobby</button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;