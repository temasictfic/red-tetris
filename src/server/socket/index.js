import Player from '../classes/Player.js';
import Game from '../classes/Game.js';
import { SOCKET_EVENTS } from '../../shared/constants/tetriminos.js';

// Store for active games
const games = new Map();

/**
 * Set up Socket.io handlers
 * @param {SocketIO.Server} io - Socket.io server instance
 */
function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    /**
     * Handle player joining a room
     */
    socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, playerName }) => {
      try {
        // Validation
        if (!roomId || !playerName) {
          return socket.emit(SOCKET_EVENTS.ERROR, { 
            message: 'Room ID and player name are required' 
          });
        }
        
        // Create game if it doesn't exist
        if (!games.has(roomId)) {
          games.set(roomId, new Game(roomId));
        }
        
        const game = games.get(roomId);
        
        // Check if game is in progress
        if (game.state === 'playing') {
          return socket.emit(SOCKET_EVENTS.ERROR, { 
            message: 'Game is already in progress. Please wait for it to finish.' 
          });
        }
        
        // Check if player name is already taken
        const isNameTaken = game.getPlayers().some(p => p.name === playerName);
        if (isNameTaken) {
          return socket.emit(SOCKET_EVENTS.ERROR, { 
            message: 'Player name is already taken in this room' 
          });
        }
        
        // Create and add player
        const player = new Player(socket.id, playerName, roomId);
        game.addPlayer(player);
        
        // Join the socket room
        socket.join(roomId);
        
        // Send joined event to the player
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, { 
          game: game.toJSON(),
          playerId: socket.id
        });
        
        // Broadcast updated player list to all in the room
        io.to(roomId).emit(SOCKET_EVENTS.PLAYERS_LIST, {
          players: game.getPlayers().map(p => p.toJSON())
        });
        
        console.log(`Player ${playerName} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join room' });
      }
    });
    
    /**
     * Handle player leaving a room
     */
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, () => {
      try {
        // Find the game this player is in
        for (const [roomId, game] of games.entries()) {
          if (game.getPlayer(socket.id)) {
            // Get player before removing
            const player = game.getPlayer(socket.id);
            
            // Remove player from game
            game.removePlayer(socket.id);
            
            // Leave the socket room
            socket.leave(roomId);
            
            // Send left event to the player
            socket.emit(SOCKET_EVENTS.ROOM_LEFT);
            
            // If no players left, remove the game
            if (game.getPlayers().length === 0) {
              games.delete(roomId);
              console.log(`Room ${roomId} removed (no players left)`);
            } else {
              // Broadcast updated player list to all in the room
              io.to(roomId).emit(SOCKET_EVENTS.PLAYERS_LIST, {
                players: game.getPlayers().map(p => p.toJSON())
              });
            }
            
            console.log(`Player ${player.name} left room ${roomId}`);
            break;
          }
        }
      } catch (error) {
        console.error('Error leaving room:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to leave room' });
      }
    });
    
    /**
     * Handle player ready status
     */
    socket.on(SOCKET_EVENTS.PLAYER_READY, ({ ready }) => {
      try {
        // Find the game this player is in
        for (const [roomId, game] of games.entries()) {
          const player = game.getPlayer(socket.id);
          if (player) {
            // Update ready status
            ready ? player.ready() : player.notReady();
            
            // Broadcast updated player list
            io.to(roomId).emit(SOCKET_EVENTS.PLAYERS_LIST, {
              players: game.getPlayers().map(p => p.toJSON())
            });
            
            break;
          }
        }
      } catch (error) {
        console.error('Error updating ready status:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to update ready status' });
      }
    });
    
    /**
     * Handle game start request (from leader)
     */
    socket.on(SOCKET_EVENTS.START_GAME, () => {
      try {
        // Find the game this player is in
        for (const [roomId, game] of games.entries()) {
          // Check if this player is the leader
          if (game.leader === socket.id) {
            // Check if all players are ready
            if (!game.areAllPlayersReady()) {
              return socket.emit(SOCKET_EVENTS.ERROR, { 
                message: 'Not all players are ready' 
              });
            }
            
            // Start the game
            const success = game.startGame();
            if (!success) {
              return socket.emit(SOCKET_EVENTS.ERROR, { 
                message: 'Failed to start game' 
              });
            }
            
            // Send game started event to all in the room
            io.to(roomId).emit(SOCKET_EVENTS.GAME_STARTED, { 
              game: game.toJSON() 
            });
            
            // Send initial pieces to all players
            for (const player of game.getPlayers()) {
              io.to(player.id).emit(SOCKET_EVENTS.NEW_PIECE, {
                currentPiece: player.currentPiece.toJSON(),
                nextPiece: player.nextPiece.toJSON()
              });
            }
            
            console.log(`Game started in room ${roomId}`);
            break;
          }
        }
      } catch (error) {
        console.error('Error starting game:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to start game' });
      }
    });
    
    /**
     * Handle player move
     */
    socket.on(SOCKET_EVENTS.PLAYER_MOVE, ({ moveType }) => {
      try {
        // Find the game this player is in
        for (const [roomId, game] of games.entries()) {
          const player = game.getPlayer(socket.id);
          if (player && player.isPlaying && !player.isGameOver) {
            // Handle the move
            const result = game.handlePlayerMove(socket.id, moveType);
            if (!result) continue;
            
            // Send board update to the player
            socket.emit(SOCKET_EVENTS.BOARD_UPDATE, {
              board: player.board,
              currentPiece: player.currentPiece.toJSON(),
              nextPiece: result.nextPiece
            });
            
            // If lines were cleared, send event
            if (result.clearedLines) {
              socket.emit(SOCKET_EVENTS.LINES_CLEARED, {
                lines: result.clearedLines,
                score: player.score
              });
            }
            
            // Update player's spectrum for all other players
            const playerSpectrum = {
              playerId: socket.id,
              spectrum: player.spectrum
            };
            socket.to(roomId).emit(SOCKET_EVENTS.SPECTRUM_UPDATE, playerSpectrum);
            
            // If penalty was sent, notify affected players
            if (result.clearedLines > 1) {
              const penaltyLines = Math.min(result.clearedLines - 1, game.maxPenaltyLines);
              if (penaltyLines > 0) {
                // Only send to playing players
                for (const p of game.getPlayers()) {
                  if (p.id !== socket.id && p.isPlaying && !p.isGameOver) {
                    io.to(p.id).emit(SOCKET_EVENTS.RECEIVE_PENALTY, {
                      lines: penaltyLines,
                      from: player.name
                    });
                    
                    // Send updated board to penalized player
                    io.to(p.id).emit(SOCKET_EVENTS.BOARD_UPDATE, {
                      board: p.board,
                      currentPiece: p.currentPiece.toJSON(),
                      nextPiece: p.nextPiece.toJSON()
                    });
                    
                    // Update player status
                    io.to(p.id).emit(SOCKET_EVENTS.PLAYER_UPDATE, {
                      player: p.toJSON()
                    });
                  }
                }
              }
            }
            
            // If game over for this player
            if (result.gameOver) {
              // Send game over event to the player
              socket.emit(SOCKET_EVENTS.GAME_OVER);
              
              // Check if the game is over for all
              if (game.state === 'game_over') {
                const winner = game.getWinner();
                if (winner) {
                  // Send game won event to the winner
                  io.to(winner.id).emit(SOCKET_EVENTS.GAME_WON);
                }
                
                // Send game over to all players
                io.to(roomId).emit(SOCKET_EVENTS.GAME_OVER, {
                  winner: winner ? winner.toJSON() : null
                });
              }
            }
            
            break;
          }
        }
      } catch (error) {
        console.error('Error handling player move:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to process move' });
      }
    });
    
    /**
     * Get list of available rooms
     */
    socket.on(SOCKET_EVENTS.ROOMS_LIST, () => {
      try {
        const roomsList = [];
        for (const [roomId, game] of games.entries()) {
          roomsList.push({
            id: roomId,
            playerCount: game.getPlayers().length,
            state: game.state
          });
        }
        
        socket.emit(SOCKET_EVENTS.ROOMS_LIST, { rooms: roomsList });
      } catch (error) {
        console.error('Error getting rooms list:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to get rooms list' });
      }
    });
    
    /**
     * Handle disconnect
     */
    socket.on('disconnect', () => {
      try {
        console.log(`Client disconnected: ${socket.id}`);
        
        // Find and remove player from any games
        for (const [roomId, game] of games.entries()) {
          const player = game.getPlayer(socket.id);
          if (player) {
            // Remove player from game
            game.removePlayer(socket.id);
            
            // If no players left, remove the game
            if (game.getPlayers().length === 0) {
              games.delete(roomId);
              console.log(`Room ${roomId} removed (no players left)`);
            } else {
              // Broadcast updated player list
              io.to(roomId).emit(SOCKET_EVENTS.PLAYERS_LIST, {
                players: game.getPlayers().map(p => p.toJSON())
              });
            }
            
            console.log(`Player ${player.name} left room ${roomId} (disconnected)`);
            break;
          }
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
}

export default setupSocketHandlers;