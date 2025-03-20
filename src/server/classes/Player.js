import { createEmptyBoard, computeSpectrum } from '../../shared/functions/gameLogic.js';

/**
 * Class representing a player in the game
 */
class Player {
  /**
   * Create a player
   * @param {string} id - Socket ID of the player
   * @param {string} name - Display name of the player
   * @param {string} roomId - ID of the room the player is in
   */
  constructor(id, name, roomId) {
    this.id = id;
    this.name = name;
    this.roomId = roomId;
    this.board = createEmptyBoard();
    this.currentPiece = null;
    this.nextPiece = null;
    this.isReady = false;
    this.isPlaying = false;
    this.isGameOver = false;
    this.isLeader = false;
    this.score = 0;
    this.linesCleared = 0;
    this.spectrum = Array(10).fill(20); // Initial spectrum (all empty)
  }

  /**
   * Update the player's board
   * @param {Array<Array<number|null>>} newBoard - New board state
   */
  updateBoard(newBoard) {
    this.board = newBoard;
    this.updateSpectrum();
  }

  /**
   * Update the player's spectrum based on current board
   */
  updateSpectrum() {
    this.spectrum = computeSpectrum(this.board);
  }

  /**
   * Set the player's current piece
   * @param {Piece} piece - The current active piece
   */
  setCurrentPiece(piece) {
    this.currentPiece = piece;
  }

  /**
   * Set the player's next piece
   * @param {Piece} piece - The next piece to play
   */
  setNextPiece(piece) {
    this.nextPiece = piece;
  }

  /**
   * Mark the player as ready to play
   */
  ready() {
    this.isReady = true;
  }

  /**
   * Mark the player as not ready to play
   */
  notReady() {
    this.isReady = false;
  }

  /**
   * Start the game for this player
   */
  startGame() {
    this.isPlaying = true;
    this.isGameOver = false;
    this.board = createEmptyBoard();
    this.score = 0;
    this.linesCleared = 0;
    this.updateSpectrum();
  }

  /**
   * End the game for this player
   */
  endGame() {
    this.isPlaying = false;
    this.isGameOver = true;
  }

  /**
   * Add to the player's score
   * @param {number} points - Points to add
   */
  addScore(points) {
    this.score += points;
  }

  /**
   * Add cleared lines to the player's count
   * @param {number} lines - Number of lines cleared
   */
  addLinesCleared(lines) {
    this.linesCleared += lines;
  }

  /**
   * Set the player as the room leader
   * @param {boolean} isLeader - Whether the player is the leader
   */
  setLeader(isLeader) {
    this.isLeader = isLeader;
  }

  /**
   * Get the player data for client
   * @returns {Object} - Player data for client
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      roomId: this.roomId,
      isReady: this.isReady,
      isPlaying: this.isPlaying,
      isGameOver: this.isGameOver,
      isLeader: this.isLeader,
      score: this.score,
      linesCleared: this.linesCleared,
      spectrum: this.spectrum,
    };
  }
}

export default Player;