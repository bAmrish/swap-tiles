import {Component} from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  seedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  numbers: number[] = [];
  moves = 0;
  gameWon = false;
  BLANK_TILE = 9;

  ngOnInit() {
    this.newGame();
  }

  newGame = () => {
    this.moves = 0;
    this.gameWon = false;
    this.numbers = [];
    const startNumbers = this.seedNumbers.slice(0);
    while (startNumbers.length != 0) {
      const pick = Math.random() * startNumbers.length;
      const n = startNumbers.splice(pick, 1);
      this.numbers.push(n[0])
    }
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

  private isGameWon() {
    let won = true;
    for (let index = 0; index < this.numbers.length; index++) {
      const number = this.numbers[index];
      if (number != index + 1) {
        won = false;
      }
    }

    return won;
  }

  // noinspection JSMethodCanBeStatic
  private canSwap(posNumber: number, posBlank: number): boolean {
    switch (posNumber) {
      case 0:
        return posBlank == 1 || posBlank == 3;
      case 1:
        return posBlank == 0 || posBlank == 2 || posBlank == 4;
      case 2:
        return posBlank == 1 || posBlank == 5;
      case 3:
        return posBlank == 0 || posBlank == 4 || posBlank == 6;
      case 4:
        return posBlank == 1 || posBlank == 3 || posBlank == 5 || posBlank == 7;
      case 5:
        return posBlank == 2 || posBlank == 4 || posBlank == 8;
      case 6:
        return posBlank == 3 || posBlank == 7;
      case 7:
        return posBlank == 4 || posBlank == 6 || posBlank == 8;
      case 8:
        return posBlank == 5 || posBlank == 7;
      default:
        return false
    }
  }
}
