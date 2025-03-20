import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getRoomsList } from '../socket';
import { setError, clearError } from '../redux/slices/gameSlice';

const HomePage = () => {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [roomIdError, setRoomIdError] = useState('');
  const [playerNameError, setPlayerNameError] = useState('');
  
  const { rooms } = useSelector(state => state.socket);
  const { error } = useSelector(state => state.game);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get available rooms when component mounts
    getRoomsList();
    
    // Set up interval to refresh rooms list
    const interval = setInterval(() => {
      getRoomsList();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      dispatch(clearError());
    };
  }, [dispatch]);
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate room ID
    if (!roomId.trim()) {
      setRoomIdError('Room ID is required');
      isValid = false;
    } else if (!/^[a-zA-Z0-9_-]+$/.test(roomId)) {
      setRoomIdError('Room ID can only contain letters, numbers, hyphens, and underscores');
      isValid = false;
    } else {
      setRoomIdError('');
    }
    
    // Validate player name
    if (!playerName.trim()) {
      setPlayerNameError('Player name is required');
      isValid = false;
    } else if (!/^[a-zA-Z0-9_-]+$/.test(playerName)) {
      setPlayerNameError('Player name can only contain letters, numbers, hyphens, and underscores');
      isValid = false;
    } else {
      setPlayerNameError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Navigate to the game room
      navigate(`/${roomId}/${playerName}`);
    }
  };
  
  return (
    <div className="home-page">
      <div className="p-2 text-center">
        <h1 className="mb-2">Red Tetris</h1>
        <p className="mb-2">Multiplayer Tetris with Socket.io and React</p>
      </div>
      
      <div className="grid">
        <div className="p-2">
          <h2>Join a Game</h2>
          {error && (
            <div className="error-message mb-1" style={{ color: 'red' }}>
              {error}
              <button 
                onClick={() => dispatch(clearError())} 
                style={{ marginLeft: '10px', background: 'transparent', padding: '0 5px' }}
              >
                ✕
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label htmlFor="roomId">Room ID</label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                style={{ width: '100%' }}
              />
              {roomIdError && <div className="error-message" style={{ color: 'red' }}>{roomIdError}</div>}
            </div>
            
            <div className="mb-1">
              <label htmlFor="playerName">Player Name</label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="Enter player name"
                style={{ width: '100%' }}
              />
              {playerNameError && <div className="error-message" style={{ color: 'red' }}>{playerNameError}</div>}
            </div>
            
            <button type="submit" className="mt-1" style={{ width: '100%' }}>
              Join Game
            </button>
          </form>
        </div>
        
        <div className="p-2">
          <h2>Available Rooms</h2>
          {rooms && rooms.length > 0 ? (
            <div className="rooms-list">
              {rooms.map(room => (
                <div key={room.id} className="player-item">
                  <div>
                    <span className="player-name">{room.id}</span>
                    <div>Players: {room.playerCount}</div>
                    <div>Status: {room.state}</div>
                  </div>
                  <button 
                    onClick={() => {
                      setRoomId(room.id);
                    }}
                    disabled={room.state === 'playing'}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-2">
              <p>No active rooms available.</p>
              <p>Create a new room by entering a unique Room ID.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center mt-2">
        <h2>How to Play</h2>
        <div className="grid p-2">
          <div>
            <h3>Controls</h3>
            <ul style={{ listStyle: 'none' }}>
              <li>Left Arrow: Move Left</li>
              <li>Right Arrow: Move Right</li>
              <li>Down Arrow: Move Down</li>
              <li>Up Arrow: Rotate</li>
              <li>Spacebar: Hard Drop</li>
            </ul>
          </div>
          <div>
            <h3>Rules</h3>
            <ul style={{ listStyle: 'none' }}>
              <li>Clear lines to send penalties to opponents</li>
              <li>Each cleared line (after the first) sends a penalty line</li>
              <li>Last player standing wins</li>
              <li>The first player to join is the room leader</li>
              <li>Only the leader can start the game</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;