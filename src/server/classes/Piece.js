import { TETRIMINOS } from '../../shared/constants/tetriminos.js';

/**
 * Class representing a Tetris piece
 */
class Piece {
  /**
   * Create a Piece
   * @param {string} type - Type of tetrimino (I, J, L, O, S, T, Z)
   */
  constructor(type) {
    this.type = type;
    this.rotation = 0;
    this.x = 3; // Starting x position (centered)
    this.y = -2; // Starting y position (above the board)
    this.shape = TETRIMINOS[type].shape[this.rotation];
    this.color = TETRIMINOS[type].color;
  }

  /**
   * Get the current shape based on rotation
   * @returns {Array<Array<number>>} - 2D array representing the piece shape
   */
  getShape() {
    return TETRIMINOS[this.type].shape[this.rotation];
  }

  /**
   * Rotate the piece clockwise
   */
  rotate() {
    this.rotation = (this.rotation + 1) % TETRIMINOS[this.type].shape.length;
    this.shape = TETRIMINOS[this.type].shape[this.rotation];
  }

  /**
   * Move the piece left
   */
  moveLeft() {
    this.x -= 1;
  }

  /**
   * Move the piece right
   */
  moveRight() {
    this.x += 1;
  }

  /**
   * Move the piece down
   */
  moveDown() {
    this.y += 1;
  }

  /**
   * Set the piece position
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Get the piece data for client
   * @returns {Object} - Piece data for client
   */
  toJSON() {
    return {
      type: this.type,
      rotation: this.rotation,
      x: this.x,
      y: this.y,
      shape: this.shape,
      color: this.color,
    };
  }
}

export default Piece;