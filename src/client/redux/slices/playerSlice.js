import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
  roomId: null,
  isReady: false,
  isPlaying: false,
  isGameOver: false,
  isLeader: false,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayer: (state, action) => {
      const { id, name, roomId } = action.payload;
      state.id = id;
      state.name = name;
      state.roomId = roomId;
    },
    setReady: (state, action) => {
      state.isReady = action.payload;
    },
    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setGameOver: (state, action) => {
      state.isGameOver = action.payload;
    },
    setLeader: (state, action) => {
      state.isLeader = action.payload;
    },
    resetPlayer: () => {
      return initialState;
    },
    updatePlayerState: (state, action) => {
      const { isReady, isPlaying, isGameOver, isLeader } = action.payload;
      if (isReady !== undefined) state.isReady = isReady;
      if (isPlaying !== undefined) state.isPlaying = isPlaying;
      if (isGameOver !== undefined) state.isGameOver = isGameOver;
      if (isLeader !== undefined) state.isLeader = isLeader;
    },
  },
});

export const {
  setPlayer,
  setReady,
  setPlaying,
  setGameOver,
  setLeader,
  resetPlayer,
  updatePlayerState,
} = playerSlice.actions;

export default playerSlice.reducer;