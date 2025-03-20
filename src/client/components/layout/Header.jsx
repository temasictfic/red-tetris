import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { isConnected } = useSelector(state => state.socket);
  const { name, roomId } = useSelector(state => state.player);
  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Red Tetris
        </Link>
      </div>
      
      <div>
        {name && roomId && (
          <div>
            <span>Player: {name}</span>
            <span> | </span>
            <span>Room: {roomId}</span>
          </div>
        )}
        
        <div>
          <span>Status: </span>
          <span style={{ color: isConnected ? '#00f000' : '#f00000' }}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;