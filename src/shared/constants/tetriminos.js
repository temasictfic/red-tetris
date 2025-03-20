/**
 * Tetrimino shapes and their rotations
 * Each shape is defined by an array of arrays, where each inner array
 * represents a rotation state. Each rotation state is a 2D array of 0s and 1s.
 */
export const TETRIMINOS = {
    I: {
      shape: [
        [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
        ],
        [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
        ],
      ],
      color: 'cyan',
    },
    J: {
      shape: [
        [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        [
          [0, 1, 1],
          [0, 1, 0],
          [0, 1, 0],
        ],
        [
          [0, 0, 0],
          [1, 1, 1],
          [0, 0, 1],
        ],
        [
          [0, 1, 0],
          [0, 1, 0],
          [1, 1, 0],
        ],
      ],
      color: 'blue',
    },
    L: {
      shape: [
        [
          [0, 0, 1],
          [1, 1, 1],
          [0, 0, 0],
        ],
        [
          [0, 1, 0],
          [0, 1, 0],
          [0, 1, 1],
        ],
        [
          [0, 0, 0],
          [1, 1, 1],
          [1, 0, 0],
        ],
        [
          [1, 1, 0],
          [0, 1, 0],
          [0, 1, 0],
        ],
      ],
      color: 'orange',
    },
    O: {
      shape: [
        [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ],
      ],
      color: 'yellow',
    },
    S: {
      shape: [
        [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0],
        ],
        [
          [0, 1, 0],
          [0, 1, 1],
          [0, 0, 1],
        ],
        [
          [0, 0, 0],
          [0, 1, 1],
          [1, 1, 0],
        ],
        [
          [1, 0, 0],
          [1, 1, 0],
          [0, 1, 0],
        ],
      ],
      color: 'green',
    },
    T: {
      shape: [
        [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        [
          [0, 1, 0],
          [0, 1, 1],
          [0, 1, 0],
        ],
        [
          [0, 0, 0],
          [1, 1, 1],
          [0, 1, 0],
        ],
        [
          [0, 1, 0],
          [1, 1, 0],
          [0, 1, 0],
        ],
      ],
      color: 'purple',
    },
    Z: {
      shape: [
        [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0],
        ],
        [
          [0, 0, 1],
          [0, 1, 1],
          [0, 1, 0],
        ],
        [
          [0, 0, 0],
          [1, 1, 0],
          [0, 1, 1],
        ],
        [
          [0, 1, 0],
          [1, 1, 0],
          [1, 0, 0],
        ],
      ],
      color: 'red',
    },
  };
  
  // Tetrimino types
  export const TETRIMINO_TYPES = Object.keys(TETRIMINOS);
  
  // Board dimensions
  export const BOARD_WIDTH = 10;
  export const BOARD_HEIGHT = 20;
  
  // Game states
  export const GAME_STATES = {
    IDLE: 'idle',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
  };
  
  // Player movement actions
  export const PLAYER_ACTIONS = {
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    MOVE_DOWN: 'MOVE_DOWN',
    ROTATE: 'ROTATE',
    HARD_DROP: 'HARD_DROP',
  };
  
  // Socket event types
  export const SOCKET_EVENTS = {
    // Room events
    JOIN_ROOM: 'JOIN_ROOM',
    LEAVE_ROOM: 'LEAVE_ROOM',
    ROOM_JOINED: 'ROOM_JOINED',
    ROOM_LEFT: 'ROOM_LEFT',
    ROOMS_LIST: 'ROOMS_LIST',
    PLAYERS_LIST: 'PLAYERS_LIST',
    
    // Game events
    START_GAME: 'START_GAME',
    GAME_STARTED: 'GAME_STARTED',
    GAME_OVER: 'GAME_OVER',
    GAME_WON: 'GAME_WON',
    
    // Player events
    PLAYER_READY: 'PLAYER_READY',
    PLAYER_NOT_READY: 'PLAYER_NOT_READY',
    PLAYER_MOVE: 'PLAYER_MOVE',
    PLAYER_UPDATE: 'PLAYER_UPDATE',
    
    // Piece events
    NEW_PIECE: 'NEW_PIECE',
    
    // Board events
    BOARD_UPDATE: 'BOARD_UPDATE',
    LINES_CLEARED: 'LINES_CLEARED',
    RECEIVE_PENALTY: 'RECEIVE_PENALTY',
    
    // Spectrum events
    SPECTRUM_UPDATE: 'SPECTRUM_UPDATE',
    
    // Error events
    ERROR: 'ERROR',
  };