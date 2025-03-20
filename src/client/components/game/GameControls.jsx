import React from 'react';

const GameControls = ({ 
  isReady, 
  isLeader, 
  isPlaying, 
  canStart, 
  onReady, 
  onStartGame, 
  onBackToLobby 
}) => {
  return (
    <div className="game-controls">
      {!isPlaying && (
        <>
          <button onClick={onReady}>
            {isReady ? 'Not Ready' : 'Ready'}
          </button>
          
          {isLeader && (
            <button 
              onClick={onStartGame}
              disabled={!canStart}
              style={{ marginTop: '10px' }}
            >
              Start Game
            </button>
          )}
          
          <button 
            onClick={onBackToLobby}
            style={{ marginTop: '10px' }}
          >
            Back to Lobby
          </button>
        </>
      )}
    </div>
  );
};

export default GameControls;