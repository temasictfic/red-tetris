import React from 'react';

const PlayerList = ({ players, currentPlayerId }) => {
  if (!players || players.length === 0) {
    return (
      <div className="player-list-container">
        <h3>Players</h3>
        <p>No players in the room</p>
      </div>
    );
  }
  
  return (
    <div className="player-list-container">
      <h3>Players</h3>
      <div className="player-list">
        {players.map(player => (
          <div 
            key={player.id} 
            className="player-item"
            style={{ 
              border: player.id === currentPlayerId ? '2px solid var(--color-accent)' : 'none',
              padding: '8px'
            }}
          >
            <div className="player-info">
              <div className="player-name">
                {player.name} 
                {player.id === currentPlayerId && ' (You)'}
                {player.isLeader && <span className="player-leader"> 👑</span>}
              </div>
              
              <div className="player-status">
                {player.isGameOver ? (
                  <span className="player-not-ready">Game Over</span>
                ) : player.isPlaying ? (
                  <span style={{ color: 'var(--color-accent)' }}>Playing</span>
                ) : player.isReady ? (
                  <span className="player-ready">Ready</span>
                ) : (
                  <span className="player-not-ready">Not Ready</span>
                )}
              </div>
              
              {(player.isPlaying || player.isGameOver) && (
                <div className="player-score">
                  Score: {player.score || 0}
                </div>
              )}
            </div>
            
            {player.spectrum && (
              <div className="player-spectrum">
                <div className="spectrum">
                  {player.spectrum.map((height, index) => (
                    <div 
                      key={index}
                      className={`spectrum-cell ${height < 20 ? 'spectrum-cell-filled' : 'spectrum-cell-empty'}`}
                      style={{ 
                        height: `${20 - Math.min(height, 20)}px`,
                        backgroundColor: height < 20 ? 'var(--color-accent)' : 'transparent'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;