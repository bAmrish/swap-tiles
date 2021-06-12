// noinspection JSMethodCanBeStatic

import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Game} from '../models/game.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  dimensions = [3, 4, 5, 6, 7];
  redoStack: number[][] = []
  private DEFAULT_DIMENSION = 3;
  dimension = this.DEFAULT_DIMENSION;
  private MAX_UNDO = 100;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snacksBar: MatSnackBar) {
    this.game = this.getNewGame();
  }

  ngOnInit() {
    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        const numbers = this.getNumbersFromQueryString(params['n']);
        this.newGame(numbers);
      })
    }, 0)

  }

  newGame = (numbers?: number[]) => {
    this.game = this.getNewGame(numbers);
    this.setQuery(this.game);
  }

  reset = () => {
    this.game = this.game || this.getNewGame();
    this.game.currentMove = this.getNumbers(this.game);
    this.game.moveHistory = [];
    this.game.solved = false;
  }

  handleMove = (number: number) => {
    if (this.game.solved) {
      return;
    }
    const numbers = this.game.currentMove.slice(0);
    const BLANK_TILE = this.game.currentMove.length;
    const posBlank = numbers.indexOf(BLANK_TILE);
    const posNumber = numbers.indexOf(number);

    if (this.canSwap(posNumber, posBlank)) {
      numbers.splice(posBlank, 1, number);
      numbers.splice(posNumber, 1, BLANK_TILE);
      this.addToUndoStack(this.game, this.game.currentMove);
      this.game.currentMove = numbers;
      this.game.totalMoves++;
      this.game.solved = this.isSolved();
      if (this.game.solved) {
        this.snacksBar.open("solved", "x", {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5 * 1000
        });
      }
    }
  }

  undo() {
    const lastMove = this.game.moveHistory.pop();

    if (lastMove) {
      const currentMove = this.game.currentMove.slice(0);
      this.game.currentMove = lastMove;
      this.redoStack.push(currentMove);
    }
  }

  redo() {
    const move = this.redoStack.pop();

    if (move) {
      const currentMove = this.game.currentMove.slice(0);
      this.game.currentMove = move;
      this.game.moveHistory.push(currentMove);
    }
  }

  private getNewGame(numbers?: number[]): Game {

    if (numbers && this.isPerfectSquare(numbers.length)) {
      this.dimension = Math.sqrt(numbers.length);
    } else {
      numbers = this.getRandomNumbers(this.dimension * this.dimension);
    }

    return {
      id: this.getId(numbers),
      dimension: this.dimension,
      currentMove: numbers.slice(0),
      moveHistory: [],
      totalMoves: 0,
      neighbours: this.findNeighbours(this.dimension),
      solved: false
    };
  }

  private setQuery(game: Game) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {n: game.id},
        queryParamsHandling: 'merge' // remove to replace all query params by provided
      }).then();
  }

  private addToUndoStack(game: Game, move: number[]) {
    if (game.moveHistory.length >= this.MAX_UNDO) {
      game.moveHistory.splice(0, 1);
    }
    game.moveHistory.push(move);
  }

  private getId(numbers: number[]): string {
    return numbers.join(",");
  }

  private getNumbers(game: Game): number[] {
    return game.id.split(",")
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

  private isSolved() {
    let solved = true;
    let numbers = this.game.currentMove;
    let dimension = this.game.dimension;
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
    return this.game.neighbours[posNumber].indexOf(posBlank) != -1;
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
      //console.log(`${i} ${neighbours.sort((a, b) => a - b).join()}`);
    }
    return allNeighbours;
  }

  private getRandomNumbers(length: number): number [] {
    const startNumbers = [...new Array(length)].map((_, i) => i + 1);
    const numbers: number[] = [];

    while (startNumbers.length != 0) {
      const pick = Math.random() * startNumbers.length;
      const n = startNumbers.splice(pick, 1);
      numbers.push(n[0])
    }

    return numbers;
  }

  private isPerfectSquare(n: number) {
    return n && n > 0 && Math.sqrt(n) % 1 === 0;
  }
}
