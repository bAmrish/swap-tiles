// noinspection JSMethodCanBeStatic

import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Timer} from '../../shared/timer';
import {Puzzle} from '../models/puzzle.model';

@Component({
  selector: 'app-game',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {
  puzzle: Puzzle;
  dimensions = [3, 4, 5, 6, 7];
  isLoading = false;
  private DEFAULT_DIMENSION = 4;
  dimension = this.DEFAULT_DIMENSION;
  private MAX_UNDO = 100;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snacksBar: MatSnackBar) {
    this.puzzle = this.getNewPuzzle();
  }

  ngOnInit() {
    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        const numbers = this.getNumbersFromQueryString(params['n']);
        this.newPuzzle(numbers);
      })
    }, 0)

  }

  newPuzzle = (numbers?: number[]) => {
    this.puzzle = this.getNewPuzzle(numbers);
    this.setQuery(this.puzzle);
  }

  reset = () => {
    this.puzzle = this.puzzle || this.getNewPuzzle();
    this.puzzle.currentMove = this.getNumbers(this.puzzle);
    this.puzzle.moveHistory = [];
    this.puzzle.solved = false;
    this.puzzle.timer = new Timer().start();
    this.puzzle.redoStack = [];
    this.puzzle.resetCounter += 1;
    this.puzzle.lastResetAt = new Date();
  }

  handleMove = (number: number) => {
    if (this.puzzle.solved) {
      return;
    }
    const numbers = this.puzzle.currentMove.slice(0);
    const posBlank = numbers.indexOf(this.puzzle.BLANK_TILE);
    const posNumber = numbers.indexOf(number);

    if (this.canSwap(posNumber, posBlank)) {
      numbers.splice(posBlank, 1, number);
      numbers.splice(posNumber, 1, this.puzzle.BLANK_TILE);
      this.addToUndoStack(this.puzzle, this.puzzle.currentMove);
      this.puzzle.currentMove = numbers;
      this.puzzle.totalMoves++;
      this.puzzle.solved = this.isSolved(this.puzzle);
      if (this.puzzle.solved) {
        this.puzzle.timer?.stop();
        this.puzzle.solvedAt = new Date();
        this.puzzle.solveTime = this.puzzle.timer.getTime();
        this.snacksBar.open("solved", "x", {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5 * 1000
        });
      }
    }
  }

  pause = () => {
    this.puzzle.paused = true
    this.puzzle.timer?.stop();
  }

  unPause = () => {
    this.puzzle.paused = false;
    this.puzzle.timer?.start();
  }

  undo = () => {
    const lastMove = this.puzzle.moveHistory.pop();

    if (lastMove) {
      const currentMove = this.puzzle.currentMove.slice(0);
      this.puzzle.currentMove = lastMove;
      this.puzzle.redoStack.push(currentMove);
    }
  }

  redo = () => {
    const move = this.puzzle.redoStack.pop();

    if (move) {
      const currentMove = this.puzzle.currentMove.slice(0);
      this.puzzle.currentMove = move;
      this.puzzle.moveHistory.push(currentMove);
    }
  }

  private getNewPuzzle(numbers?: number[]): Puzzle {
    this.isLoading = true;
    if (numbers && this.isPerfectSquare(numbers.length)) {
      this.dimension = Math.sqrt(numbers.length);
    } else {
      numbers = this.generatePuzzle(this.dimension * this.dimension);
    }
    this.isLoading = false;
    return {
      id: this.getId(numbers),
      dimension: this.dimension,
      currentMove: numbers.slice(0),
      moveHistory: [],
      redoStack: [],
      totalMoves: 0,
      neighbours: this.findNeighbours(this.dimension),
      paused: false,
      solved: false,
      BLANK_TILE: this.dimension * this.dimension,
      timer: new Timer().start(),
      resetCounter: 0,
      createdAt: new Date()
    };
  }

  private setQuery(game: Puzzle) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {n: game.id},
        queryParamsHandling: 'merge' // remove to replace all query params by provided
      }).then();
  }

  private addToUndoStack(puzzle: Puzzle, move: number[]) {
    if (puzzle.moveHistory.length >= this.MAX_UNDO) {
      puzzle.moveHistory.splice(0, 1);
    }
    puzzle.moveHistory.push(move);
  }

  private getId(numbers: number[]): string {
    return numbers.join(",");
  }

  private getNumbers(puzzle: Puzzle): number[] {
    return puzzle.id.split(",")
      .map((d: string) => parseInt(d, 10));
  }

  private getNumbersFromQueryString(data: string): number[] {
    let isValid = true;
    let dimension = this.DEFAULT_DIMENSION;
    let numbers: number[] = [];
    if (data) {
      numbers = data.split(",")
        .map((d: string) => parseInt(d, 10))
        .filter((c: number) => !isNaN(c));

      const sqrt = Math.floor(Math.sqrt(numbers.length));

      if (sqrt * sqrt === numbers.length) { // its a perfect square
        dimension = sqrt;

        for (let i = 1; i <= dimension; i++) {
          if (numbers.indexOf(i) == -1) {
            isValid = false;
            break;
          }
        }
      } else {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    if (isValid) {
      return numbers;
    } else {
      return [];
    }
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

  private canSwap(posNumber: number, posBlank: number): boolean {
    return this.puzzle.neighbours[posNumber].indexOf(posBlank) != -1;
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

  private generatePuzzle(length: number): number [] {
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

  private isPerfectSquare(n: number) {
    return n && n > 0 && Math.sqrt(n) % 1 === 0;
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
}
