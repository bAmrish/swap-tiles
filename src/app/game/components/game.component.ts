// noinspection JSMethodCanBeStatic

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Game} from '../models/game.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  dimensions = [3, 4, 5, 6, 7, 8, 9, 10];
  private DEFAULT_DIMENSION = 3;
  dimension = this.DEFAULT_DIMENSION;


  constructor(private route: ActivatedRoute, private router: Router) {
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

  getNewGame(numbers?: number[]): Game {
    const totalNumbers = this.dimension * this.dimension;

    if (!numbers || numbers.length != totalNumbers) {
      numbers = this.getRandomNumbers(totalNumbers);
    }

    return {
      id: this.getId(numbers),
      dimension: this.dimension,
      numbers: numbers.slice(0),
      moves: [],
      neighbours: this.findNeighbours(this.dimension),
      won: false
    };
  }

  reset = () => {
    this.game = this.game || this.getNewGame();
    this.game.numbers = this.getNumbers(this.game);
    this.game.moves = [];
    this.game.won = false;
  }

  handleMove = (number: number) => {
    if (this.game.won) {
      return;
    }
    const numbers = this.game.numbers;
    const BLANK_TILE = this.game.numbers.length;
    const posBlank = numbers.indexOf(BLANK_TILE);
    const posNumber = numbers.indexOf(number);

    if (this.canSwap(posNumber, posBlank)) {
      numbers.splice(posBlank, 1, number);
      numbers.splice(posNumber, 1, BLANK_TILE);
      this.game.moves.push(numbers);
      this.game.won = this.isGameWon();
    }
  }

  setQuery(game: Game) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {n: game.id},
        queryParamsHandling: 'merge' // remove to replace all query params by provided
      }).then();
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

  private isGameWon() {
    let won = true;
    let numbers = this.game.numbers;
    let dimension = this.game.dimension;
    for (let index = 0; index < numbers.length; index++) {
      const number = numbers[index];
      const totalTiles = dimension * dimension;
      if ((number === totalTiles - 2 || number === totalTiles - 1)
        && (index !== totalTiles - 3 && index !== totalTiles - 2)) {
        won = false
      }
      if (number < totalTiles - 2 && number !== index + 1) {
        won = false;
      }
    }
    return won;
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
}
