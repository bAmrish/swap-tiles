import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  dimensions = [3, 4, 5, 6, 7, 8, 9, 10];
  seedNumbers: number[] = [];
  neighbours: Record<number, number[]> = {};
  startNumbers: number[] = [];
  numbers: number[] = [];
  moves = 0;
  gameWon = false;
  BLANK_TILE = 0;
  private DEFAULT_DIMENSION = 3;
  dimension = this.DEFAULT_DIMENSION;
  private MIN_DIMENSION = 3;
  private MAX_DIMENSION = 10;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        this.newGame(...this.getDataFromQuery(params['n']));
      })
    }, 0)

  }

  newGame = (numbers: number[] | null, dimension: number) => {
    this.moves = 0;
    this.gameWon = false;
    this.numbers = [];

    if (!dimension || dimension < this.MIN_DIMENSION || dimension > this.MAX_DIMENSION) {
      this.dimension = this.DEFAULT_DIMENSION;
    } else {
      this.dimension = dimension;
    }
    this.neighbours = this.findNeighbours(this.dimension);
    this.seedNumbers =
      [...new Array(this.dimension * this.dimension)]
        .map((_, i) => i + 1);
    this.BLANK_TILE = this.dimension * this.dimension;

    if (!numbers || numbers.length == 0 || numbers.length != dimension * dimension) {
      const startNumbers = this.seedNumbers.slice(0);
      while (startNumbers.length != 0) {
        const pick = Math.random() * startNumbers.length;
        const n = startNumbers.splice(pick, 1);
        this.numbers.push(n[0])
      }
    } else {
      this.numbers = numbers;
      this.dimension = dimension;
    }

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {n: this.numbers.join(",")},
        queryParamsHandling: 'merge' // remove to replace all query params by provided
      }).then();

    this.startNumbers = this.numbers.slice(0);
  }

  reset = () => {
    this.numbers = this.startNumbers.slice(0);
    this.moves = 0;
    this.gameWon = false;
  }

  handleMove = (number: number) => {
    if (this.gameWon) {
      return;
    }

    const posBlank = this.numbers.indexOf(this.BLANK_TILE);
    const posNumber = this.numbers.indexOf(number);

    if (this.canSwap(posNumber, posBlank)) {
      this.numbers.splice(posBlank, 1, number);
      this.numbers.splice(posNumber, 1, this.BLANK_TILE);
      this.moves++;
      this.gameWon = this.isGameWon();
    }
  }

  private getDataFromQuery(data: string): [number[] | null, number] {
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
      return [numbers, dimension];
    } else {
      return [null, dimension];
    }
  }

  private isGameWon() {
    let won = true;
    for (let index = 0; index < this.numbers.length; index++) {
      const number = this.numbers[index];
      const totalTiles = this.dimension * this.dimension;
      if ((number === totalTiles - 2 || number === totalTiles - 1) && (index !== totalTiles - 3 && index !== totalTiles - 2)) {
        won = false
      }
      if (number < totalTiles - 2 && number !== index + 1) {
        won = false;
      }
    }

    return won;
  }

  // noinspection JSMethodCanBeStatic
  private canSwap(posNumber: number, posBlank: number): boolean {
    return this.neighbours[posNumber].indexOf(posBlank) != -1;
  }

  // noinspection JSMethodCanBeStatic
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
}
