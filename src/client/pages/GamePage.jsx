import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { joinRoom, leaveRoom, setPlayerReady, startGame } from '../socket';
import { setPlayer } from '../redux/slices/playerSlice';
import { setLoading, setError, clearError } from '../redux/slices/gameSlice';

// Components
import GameBoard from '../components/game/GameBoard';
import NextPiece from '../components/game/NextPiece';
import PlayerList from '../components/game/PlayerList';
import GameControls from '../components/game/GameControls';
import GameInfo from '../components/game/GameInfo';
import GameOverModal from '../components/game/GameOverModal';

const GamePage = () => {
  const { roomId, playerName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isConnected } = useSelector(state => state.socket);
  const { id, state, players, isLoading, error, gameOver, winner } = useSelector(state => state.game);
  const { id: playerId, isReady, isPlaying, isGameOver, isLeader } = useSelector(state => state.player);
  
  const [showGameOver, setShowGameOver] = useState(false);
  
  // Join the room when component mounts
  useEffect(() => {
    if (!roomId || !playerName) {
      navigate('/');
      return;
    }
    
    if (isConnected) {
      dispatch(setLoading(true));
      dispatch(setPlayer({ name: playerName, roomId }));
      joinRoom(roomId, playerName);
    }
    
    // Clean up when component unmounts
    return () => {
      leaveRoom();
    };
  }, [roomId, playerName, isConnected, dispatch, navigate]);
  
  // Show game over modal when game ends
  useEffect(() => {
    if (gameOver) {
      setShowGameOver(true);
    }
  }, [gameOver]);
  
  // Handle ready button click
  const handleReadyClick = () => {
    setPlayerReady(!isReady);
  };
  
  // Handle start game button click
  const handleStartGameClick = () => {
    if (isLeader) {
      startGame();
    }
  };
  
  // Handle back to lobby button click
  const handleBackToLobbyClick = () => {
    navigate('/');
  };
  
  // Redirect to home if not loaded or error
  if (isLoading) {
    return (
      <div className="flex justify-center align-center" style={{ height: '80vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-2">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(clearError())}>Dismiss</button>
        <button onClick={handleBackToLobbyClick} className="mt-1">Back to Home</button>
      </div>
    );
  }
  
  return (
    <div className="game-page">
      <div className="grid">
        <div>
          <h2>Room: {roomId}</h2>
          <div className="flex">
            <div>
              {isPlaying ? (
                <div className="game-container">
                  <GameBoard />
                  <div className="game-sidebar">
                    <NextPiece />
                    <GameInfo />
                  </div>
                </div>
              ) : (
                <div className="lobby-container p-2">
                  <h3>Waiting for players...</h3>
                  <p>Game Status: {state}</p>
                  {isLeader && (
                    <div className="leader-notice mb-1">
                      <p>You are the room leader!</p>
                      <p>You can start the game when all players are ready.</p>
                    </div>
                  )}
                  <GameControls 
                    isReady={isReady}
                    isLeader={isLeader}
                    isPlaying={isPlaying}
                    canStart={players.every(p => p.isReady)}
                    onReady={handleReadyClick}
                    onStartGame={handleStartGameClick}
                    onBackToLobby={handleBackToLobbyClick}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <PlayerList 
            players={players} 
            currentPlayerId={playerId} 
          />
        </div>
      </div>
      
      {showGameOver && (
        <GameOverModal 
          winner={winner}
          isWinner={winner && winner.id === playerId}
          onClose={() => setShowGameOver(false)}
          onBackToLobby={handleBackToLobbyClick}
        />
      )}
    </div>
  );
};

export default GamePage;