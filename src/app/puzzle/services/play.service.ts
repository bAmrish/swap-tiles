import {Injectable} from '@angular/core';
import {Puzzle, PuzzleType} from '../models/puzzle.model';

// noinspection JSMethodCanBeStatic
@Injectable({providedIn: 'root'})
export class PlayService {
  private MAX_UNDO = 100;
  private DEFAULT_DIMENSION = 4;
  private MAX_PICTURE_ID = 5;

  move(puzzle: Puzzle, number: number) {
    if (puzzle.solved) {
      return;
    }
    const numbers = puzzle.currentMove.slice(0);
    const posBlank = numbers.indexOf(puzzle.BLANK_TILE);
    const posNumber = numbers.indexOf(number);

    if (this.canSwap(puzzle, posNumber, posBlank)) {
      numbers.splice(posBlank, 1, number);
      numbers.splice(posNumber, 1, puzzle.BLANK_TILE);
      this.addToUndoStack(puzzle, puzzle.currentMove);
      puzzle.currentMove = numbers;
      puzzle.totalMoves++;
      puzzle.solved = this.isSolved(puzzle);
    }
  }

  undo(puzzle: Puzzle) {
    const lastMove = puzzle.moveHistory.pop();

    if (lastMove) {
      const currentMove = puzzle.currentMove.slice(0);
      puzzle.currentMove = lastMove;
      puzzle.redoStack.push(currentMove);
    }
  }

  redo(puzzle: Puzzle) {
    const move = puzzle.redoStack.pop();

    if (move) {
      const currentMove = puzzle.currentMove.slice(0);
      puzzle.currentMove = move;
      puzzle.moveHistory.push(currentMove);
    }
  }

  getNewPuzzle(type: PuzzleType, numbers?: number[], dimension?: number, pictureId?: string): Puzzle {
    if (!dimension) {
      dimension = this.DEFAULT_DIMENSION;
    }

    if (numbers && numbers.length > 0 && this.isPerfectSquare(numbers.length)) {
      dimension = Math.sqrt(numbers.length);
    } else {
      numbers = this.generateNumbers(dimension * dimension);
    }
    const puzzle: Puzzle = {
      id: '', dimension, type, totalMoves: 0,
      currentTime: 0, resetCounter: 0,
      moveHistory: [], redoStack: [],
      paused: false, solved: false,
      currentMove: numbers.slice(0),
      neighbours: this.findNeighbours(dimension),
      BLANK_TILE: dimension * dimension,
      createdAt: new Date()
    };
    if (puzzle.type == 'picture') {
      const id = pictureId && parseInt(pictureId);
      if(id && !isNaN(id) && id >= 1 && id <= this.MAX_PICTURE_ID) {
        puzzle.picture = id.toString();
      } else {
        puzzle.picture = Math.ceil(Math.random() * this.MAX_PICTURE_ID).toString();
      }
    }
    puzzle.id = this.getId(puzzle);
    return puzzle
  }

  reset(puzzle: Puzzle) {
    puzzle.currentMove = this.getNumbers(puzzle);
    puzzle.moveHistory = [];
    puzzle.totalMoves = 0;
    puzzle.solved = false;
    puzzle.currentTime = 0;
    puzzle.redoStack = [];
    puzzle.resetCounter += 1;
    puzzle.lastResetAt = new Date();
  }

  private getNumbers(puzzle: Puzzle): number[] {
    return puzzle.id.split(",")
      .map((d: string) => parseInt(d, 10));
  }

  private addToUndoStack(puzzle: Puzzle, move: number[]) {
    if (puzzle.moveHistory.length >= this.MAX_UNDO) {
      puzzle.moveHistory.splice(0, 1);
    }
    puzzle.moveHistory.push(move);
  }

  private isSolved(puzzle: Puzzle) {
    let solved = true;
    let numbers = puzzle.currentMove;
    let dimension = puzzle.dimension;
    for (let index = 0; index < numbers.length; index++) {
      const number = numbers[index];
      const totalTiles = dimension * dimension;
      if ((number === totalTiles - 2 || number === totalTiles - 1)
        && (index !== totalTiles - 3 && index !== totalTiles - 2)) {
        solved = false
      }
      if (number < totalTiles - 2 && number !== index + 1) {
        solved = false;
      }
    }
    return solved;
  }

  private canSwap(puzzle: Puzzle, posNumber: number, posBlank: number): boolean {
    return puzzle.neighbours[posNumber].indexOf(posBlank) != -1;
  }

  private isPerfectSquare(n: number) {
    return n && n > 0 && Math.sqrt(n) % 1 === 0;
  }

  private generateNumbers(length: number): number [] {
    let solvable = false;

    const MAX_ITERATIONS = 1000;
    let numbers = [];
    let iterations = 0;
    while (!solvable) {
      numbers = [];
      const startNumbers = [...new Array(length)].map((_, i) => i + 1);
      while (startNumbers.length != 0 && iterations <= MAX_ITERATIONS) {
        const pick = Math.random() * startNumbers.length;
        const n = startNumbers.splice(pick, 1);
        numbers.push(n[0])
      }
      solvable = this.isSolvable(numbers, Math.sqrt(length))
      iterations++;
    }
    return numbers;
  }

  private isSolvable(numbers: number[], dimension: number): boolean {
    const inversion = this.calculateInversions(numbers, dimension);
    //If N is odd, then puzzle instance is solvable if number of inversions is even in the input state.
    if (dimension % 2 != 0) {
      return inversion % 2 == 0
    }

    const indexOfBlankTile = numbers.indexOf(dimension * dimension);
    const row = Math.floor(indexOfBlankTile / dimension);
    const rowFromBottom = (dimension - row)

    // If N is even, puzzle instance is solvable if
    //  the blank is on an even row counting from the bottom (second-last, fourth-last, etc.) and number of inversions is odd.
    //  the blank is on an odd row counting from the bottom (last, third-last, fifth-last, etc.) and number of inversions is even.
    if (rowFromBottom % 2 === 0 && inversion % 2 !== 0) {
      return true;
    }

    // noinspection RedundantIfStatementJS
    if (rowFromBottom % 2 !== 0 && inversion % 2 === 0) {
      return true
    }

    //For all other cases, the puzzle instance is not solvable.
    return false;
  }

  /**
   * What is an inversion here?
   * If we assume the tiles written out in a single row (1D Array) instead of being spread in N-rows (2D Array),
   * a pair of tiles (a, b) form an inversion if a appears before b but a > b
   * @param numbers
   * @param dimension
   * @private
   */
  private calculateInversions(numbers: number[], dimension: number): number {
    const indexOfBlankTile = numbers.indexOf(dimension * dimension);
    const nums = numbers.slice(0)
    nums.splice(indexOfBlankTile, 1);
    let inv = 0;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) {
          inv++;
        }
      }
    }
    return inv;
  }

  private findNeighbours(d: number): Record<number, number[]> {
    const allNeighbours: Record<number, number[]> = {};
    for (let i = 0; i < d * d; i++) {
      const neighbours: number[] = [];
      const row = Math.floor(i / d);
      const col = i % d;

      if (col !== 0) {
        neighbours.push(i - 1);
      }
      if (col !== d - 1) {
        neighbours.push(i + 1);
      }
      if (row !== 0) {
        neighbours.push((d * (row - 1)) + col);
      }
      if (row !== d - 1) {
        neighbours.push((d * (row + 1)) + col);
      }

      allNeighbours[i] = neighbours;
    }
    return allNeighbours;
  }

  private getId(puzzle: Puzzle): string {
    return puzzle.currentMove.slice(0).join(',');
  }

}
