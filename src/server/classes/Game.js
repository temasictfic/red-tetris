import Piece from './Piece.js';
import { TETRIMINO_TYPES, GAME_STATES } from '../../shared/constants/tetriminos.js';
import { isValidPosition, addPieceToBoard, clearLines, addPenaltyLines } from '../../shared/functions/gameLogic.js';

/**
 * Class representing a Tetris game
 */
class Game {
  /**
   * Create a Game
   * @param {string} id - ID of the game room
   */
  constructor(id) {
    this.id = id;
    this.players = new Map(); // Map of player IDs to Player objects
    this.state = GAME_STATES.IDLE;
    this.leader = null; // Socket ID of the leader
    this.pieceSequence = []; // Sequence of pieces for all players
    this.pieceIndex = 0; // Current index in the piece sequence
    this.lastUpdateTime = 0;
    this.speed = 1000; // Initial speed in ms
    this.maxPenaltyLines = 4; // Maximum penalty lines per attack
  }

  /**
   * Add a player to the game
   * @param {Player} player - Player to add
   */
  addPlayer(player) {
    this.players.set(player.id, player);
    
    // If this is the first player, make them the leader
    if (this.players.size === 1) {
      this.setLeader(player.id);
    }
  }

  /**
   * Remove a player from the game
   * @param {string} playerId - ID of the player to remove
   * @returns {boolean} - True if the player was removed
   */
  removePlayer(playerId) {
    const success = this.players.delete(playerId);
    
    // If the leader left, assign a new leader
    if (success && this.leader === playerId && this.players.size > 0) {
      const nextLeaderId = this.players.keys().next().value;
      this.setLeader(nextLeaderId);
    }
    
    return success;
  }

  /**
   * Set a player as the leader
   * @param {string} playerId - ID of the player to set as leader
   */
  setLeader(playerId) {
    // Reset leader status for all players
    for (const player of this.players.values()) {
      player.setLeader(false);
    }
    
    this.leader = playerId;
    const leaderPlayer = this.players.get(playerId);
    if (leaderPlayer) {
      leaderPlayer.setLeader(true);
    }
  }

  /**
   * Get all players in the game
   * @returns {Array<Player>} - Array of players
   */
  getPlayers() {
    return Array.from(this.players.values());
  }

  /**
   * Get a player by ID
   * @param {string} playerId - ID of the player to get
   * @returns {Player|undefined} - Player object or undefined if not found
   */
  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  /**
   * Check if all players are ready
   * @returns {boolean} - True if all players are ready
   */
  areAllPlayersReady() {
    for (const player of this.players.values()) {
      if (!player.isReady) {
        return false;
      }
    }
    return this.players.size > 0;
  }

  /**
   * Check if the game is over (only one player left)
   * @returns {boolean} - True if the game is over
   */
  isGameOver() {
    let activePlayers = 0;
    for (const player of this.players.values()) {
      if (player.isPlaying && !player.isGameOver) {
        activePlayers++;
      }
    }
    return activePlayers <= 1 && this.state === GAME_STATES.PLAYING;
  }

  /**
   * Get the winner of the game
   * @returns {Player|null} - The winning player or null if no winner
   */
  getWinner() {
    for (const player of this.players.values()) {
      if (player.isPlaying && !player.isGameOver) {
        return player;
      }
    }
    return null;
  }

  /**
   * Generate a random piece sequence for all players
   * @param {number} count - Number of pieces to generate
   */
  generatePieceSequence(count = 100) {
    this.pieceSequence = [];
    for (let i = 0; i < count; i++) {
      const randomType = TETRIMINO_TYPES[Math.floor(Math.random() * TETRIMINO_TYPES.length)];
      this.pieceSequence.push(randomType);
    }
    this.pieceIndex = 0;
  }

  /**
   * Get the next piece from the sequence
   * @returns {Piece} - The next piece
   */
  getNextPiece() {
    if (this.pieceIndex >= this.pieceSequence.length) {
      // Generate more pieces if we're running out
      this.generatePieceSequence(100);
    }
    
    const type = this.pieceSequence[this.pieceIndex++];
    return new Piece(type);
  }

  /**
   * Start the game
   */
  startGame() {
    // Don't start if no players or game already in progress
    if (this.players.size === 0 || this.state === GAME_STATES.PLAYING) {
      return false;
    }
    
    // Generate piece sequence
    this.generatePieceSequence();
    
    // Initialize all players
    for (const player of this.players.values()) {
      player.startGame();
      
      // Set current and next piece for each player
      player.setCurrentPiece(this.getNextPiece());
      player.setNextPiece(this.getNextPiece());
    }
    
    this.state = GAME_STATES.PLAYING;
    this.lastUpdateTime = Date.now();
    return true;
  }

  /**
   * End the game
   */
  endGame() {
    this.state = GAME_STATES.GAME_OVER;
    
    // Set game over for all players
    for (const player of this.players.values()) {
      player.endGame();
    }
  }

  /**
   * Handle a player move
   * @param {string} playerId - ID of the player making the move
   * @param {string} moveType - Type of move (left, right, down, rotate, drop)
   * @returns {Object|null} - Result of the move or null if invalid
   */
  handlePlayerMove(playerId, moveType) {
    const player = this.players.get(playerId);
    if (!player || !player.isPlaying || player.isGameOver || !player.currentPiece) {
      return null;
    }
    
    const { board, currentPiece } = player;
    const piece = currentPiece.getShape();
    let newX = currentPiece.x;
    let newY = currentPiece.y;
    let newRotation = currentPiece.rotation;
    let locked = false;
    
    switch (moveType) {
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'rotate':
        newRotation = (currentPiece.rotation + 1) % 4;
        break;
      case 'drop':
        // Find the drop position
        while (isValidPosition(board, piece, newX, newY + 1)) {
          newY += 1;
        }
        locked = true;
        break;
      default:
        return null;
    }
    
    // For rotation, get the new piece shape
    let newPiece = piece;
    if (moveType === 'rotate') {
      newPiece = currentPiece.getShape();
    }
    
    // Check if the new position is valid
    if (!isValidPosition(board, newPiece, newX, newY)) {
      return null;
    }
    
    // Update piece position
    currentPiece.x = newX;
    currentPiece.y = newY;
    if (moveType === 'rotate') {
      currentPiece.rotate();
    }
    
    let result = { locked: false };
    
    // If the piece is locked in place
    if (locked || !isValidPosition(board, currentPiece.getShape(), newX, newY + 1)) {
      // Add the piece to the board
      const newBoard = addPieceToBoard(
        board,
        currentPiece.getShape(),
        newX,
        newY,
        currentPiece.type
      );
      
      // Check for cleared lines
      const { board: boardAfterClear, clearedLines } = clearLines(newBoard);
      
      player.updateBoard(boardAfterClear);
      
      if (clearedLines > 0) {
        player.addLinesCleared(clearedLines);
        player.addScore(clearedLines * 100);
        
        // Send penalties to other players
        const penaltyLines = Math.min(clearedLines - 1, this.maxPenaltyLines);
        if (penaltyLines > 0) {
          this.sendPenaltyToOthers(playerId, penaltyLines);
        }
        
        result.clearedLines = clearedLines;
      }
      
      // Get the next piece for the player
      player.setCurrentPiece(player.nextPiece);
      player.setNextPiece(this.getNextPiece());
      
      // Check if the game is over for this player
      if (!isValidPosition(player.board, player.currentPiece.getShape(), player.currentPiece.x, player.currentPiece.y)) {
        player.endGame();
        result.gameOver = true;
      }
      
      result.locked = true;
      result.nextPiece = player.nextPiece.toJSON();
    }
    
    // Check if the game is over for all
    if (this.isGameOver()) {
      this.endGame();
      result.gameOver = true;
      result.winner = this.getWinner()?.toJSON() || null;
    }
    
    return result;
  }

  /**
   * Send penalty lines to all players except the sender
   * @param {string} senderId - ID of the player who sent the penalty
   * @param {number} numLines - Number of penalty lines to add
   */
  sendPenaltyToOthers(senderId, numLines) {
    for (const [playerId, player] of this.players.entries()) {
      // Skip the sender and players who are not playing
      if (playerId === senderId || !player.isPlaying || player.isGameOver) {
        continue;
      }
      
      // Add penalty lines to the player's board
      const newBoard = addPenaltyLines(player.board, numLines);
      player.updateBoard(newBoard);
      
      // Check if the penalty caused a game over
      if (!isValidPosition(
        player.board,
        player.currentPiece.getShape(),
        player.currentPiece.x,
        player.currentPiece.y
      )) {
        player.endGame();
      }
    }
  }

  /**
   * Get the game data for client
   * @returns {Object} - Game data for client
   */
  toJSON() {
    return {
      id: this.id,
      state: this.state,
      leader: this.leader,
      players: this.getPlayers().map(player => player.toJSON()),
    };
  }
}

export default Game;