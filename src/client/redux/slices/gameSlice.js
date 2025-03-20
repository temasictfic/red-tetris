import { createSlice } from '@reduxjs/toolkit';
import { createEmptyBoard } from '../../../shared/functions/gameLogic';
import { GAME_STATES } from '../../../shared/constants/tetriminos';

const initialState = {
  id: null,
  state: GAME_STATES.IDLE,
  board: createEmptyBoard(),
  players: [],
  currentPiece: null,
  nextPiece: null,
  score: 0,
  linesCleared: 0,
  leader: null,
  isLoading: false,
  error: null,
  winner: null,
  gameOver: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRoomJoined: (state, action) => {
      const { game, playerId } = action.payload;
      state.id = game.id;
      state.state = game.state;
      state.players = game.players;
      state.leader = game.leader;
      state.isLoading = false;
    },
    setPlayersList: (state, action) => {
      state.players = action.payload.players;
    },
    setGameStarted: (state, action) => {
      const { game } = action.payload;
      state.state = game.state;
      state.players = game.players;
      state.board = createEmptyBoard();
      state.score = 0;
      state.linesCleared = 0;
      state.gameOver = false;
      state.winner = null;
    },
    setNewPiece: (state, action) => {
      const { currentPiece, nextPiece } = action.payload;
      state.currentPiece = currentPiece;
      state.nextPiece = nextPiece;
    },
    setBoardUpdate: (state, action) => {
      const { board, currentPiece, nextPiece } = action.payload;
      state.board = board;
      state.currentPiece = currentPiece;
      if (nextPiece) {
        state.nextPiece = nextPiece;
      }
    },
    setLinesCleared: (state, action) => {
      const { lines, score } = action.payload;
      state.linesCleared += lines;
      state.score = score;
    },
    receivePenalty: (state, action) => {
      // This will be handled by the board update that follows
    },
    setGameOver: (state, action) => {
      state.gameOver = true;
      state.state = GAME_STATES.GAME_OVER;
      if (action.payload && action.payload.winner) {
        state.winner = action.payload.winner;
      }
    },
    resetGame: (state) => {
      return {
        ...initialState,
        id: state.id,
        players: state.players,
        leader: state.leader,
      };
    },
    leaveRoom: () => {
      return initialState;
    },
    updateSpectra: (state, action) => {
      const { playerId, spectrum } = action.payload;
      state.players = state.players.map(player => {
        if (player.id === playerId) {
          return { ...player, spectrum };
        }
        return player;
      });
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setRoomJoined,
  setPlayersList,
  setGameStarted,
  setNewPiece,
  setBoardUpdate,
  setLinesCleared,
  receivePenalty,
  setGameOver,
  resetGame,
  leaveRoom,
  updateSpectra,
} = gameSlice.actions;

export default gameSlice.reducer;