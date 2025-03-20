import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: null,
  isConnected: false,
  rooms: [],
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connectionEstablished: (state, action) => {
      state.socket = action.payload;
      state.isConnected = true;
    },
    connectionLost: (state) => {
      state.isConnected = false;
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    clearSocket: () => {
      return initialState;
    },
  },
});

export const {
  connectionEstablished,
  connectionLost,
  setRooms,
  clearSocket,
} = socketSlice.actions;

export default socketSlice.reducer;