import { io } from 'socket.io-client';
import { connectionEstablished, connectionLost, setRooms } from '../redux/slices/socketSlice';
import {
  setRoomJoined,
  setPlayersList,
  setGameStarted,
  setNewPiece,
  setBoardUpdate,
  setLinesCleared,
  receivePenalty,
  setGameOver,
  setError,
  updateSpectra,
} from '../redux/slices/gameSlice';
import { updatePlayerState } from '../redux/slices/playerSlice';
import { SOCKET_EVENTS } from '../../shared/constants/tetriminos';

// Initialize the socket with Redux
let socket = null;

export const initSocket = (dispatch) => {
  if (socket) return socket;

  const serverUrl = import.meta.env.VITE_SERVER_URL || window.location.origin;
  
  // Create new socket connection
  socket = io(serverUrl, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Set up event listeners
  socket.on('connect', () => {
    console.log('Socket connected');
    dispatch(connectionEstablished(socket));
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    dispatch(connectionLost());
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    dispatch(setError('Failed to connect to server. Please try again.'));
  });

  // Game events
  socket.on(SOCKET_EVENTS.ROOM_JOINED, (data) => {
    dispatch(setRoomJoined(data));
    // Update player state based on the joined room data
    const player = data.game.players.find(p => p.id === data.playerId);
    if (player) {
      dispatch(updatePlayerState(player));
    }
  });

  socket.on(SOCKET_EVENTS.PLAYERS_LIST, (data) => {
    dispatch(setPlayersList(data));
  });

  socket.on(SOCKET_EVENTS.ROOMS_LIST, (data) => {
    dispatch(setRooms(data.rooms));
  });

  socket.on(SOCKET_EVENTS.GAME_STARTED, (data) => {
    dispatch(setGameStarted(data));
    // Update player state when game starts
    const player = data.game.players.find(p => p.id === socket.id);
    if (player) {
      dispatch(updatePlayerState({
        isPlaying: true,
        isGameOver: false,
      }));
    }
  });

  socket.on(SOCKET_EVENTS.NEW_PIECE, (data) => {
    dispatch(setNewPiece(data));
  });

  socket.on(SOCKET_EVENTS.BOARD_UPDATE, (data) => {
    dispatch(setBoardUpdate(data));
  });

  socket.on(SOCKET_EVENTS.LINES_CLEARED, (data) => {
    dispatch(setLinesCleared(data));
  });

  socket.on(SOCKET_EVENTS.RECEIVE_PENALTY, (data) => {
    dispatch(receivePenalty(data));
  });

  socket.on(SOCKET_EVENTS.GAME_OVER, (data) => {
    dispatch(setGameOver(data));
    dispatch(updatePlayerState({
      isPlaying: false,
      isGameOver: true,
    }));
  });

  socket.on(SOCKET_EVENTS.GAME_WON, () => {
    // Additional actions for the winner if needed
  });

  socket.on(SOCKET_EVENTS.SPECTRUM_UPDATE, (data) => {
    dispatch(updateSpectra(data));
  });

  socket.on(SOCKET_EVENTS.ERROR, (data) => {
    dispatch(setError(data.message));
  });

  return socket;
};

// Socket action creators (to be used in components)
export const joinRoom = (roomId, playerName) => {
  if (!socket) return;
  socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, playerName });
};

export const leaveRoom = () => {
  if (!socket) return;
  socket.emit(SOCKET_EVENTS.LEAVE_ROOM);
};

export const setPlayerReady = (ready) => {
  if (!socket) return;
  socket.emit(SOCKET_EVENTS.PLAYER_READY, { ready });
};

export const startGame = () => {
  if (!socket) return;
  socket.emit(SOCKET_EVENTS.START_GAME);
};

export const sendPlayerMove = (moveType) => {
  if (!socket) return;
  socket.emit(SOCKET_EVENTS.PLAYER_MOVE, { moveType });
};

export const getRoomsList = () => {
  if (!socket) return;
  socket.emit(SOCKET_EVENTS.ROOMS_LIST);
};

export const disconnect = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};