// noinspection JSMethodCanBeStatic
import {Component, HostListener, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Timer} from '../../shared/timer';
import {Puzzle, PuzzleType} from '../models/puzzle.model';
import {PlayService} from '../services/play.service';
import {PuzzleStorageService} from '../services/puzzle-storage.service';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {

  // @ts-ignore
  puzzle: Puzzle;
  dimensions = [3, 4, 5, 6, 7];
  isLoading = false;
  public timer: Timer | null = null;
  showHint = false;
  type: PuzzleType = 'numeric';
  private DEFAULT_DIMENSION = 4;
  dimension = this.DEFAULT_DIMENSION;
  private pictureId? = '1';

  constructor(
    private storageService: PuzzleStorageService,
    private play: PlayService,
    private route: ActivatedRoute,
    private router: Router,
    private snacksBar: MatSnackBar) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        const type = this.route.snapshot.params['type']?.trim().toLowerCase();
        switch (type) {
          case 'picture':
            this.type = 'picture';
            break;
          default:
            this.type = 'numeric';
        }

        const id = params['n'];
        const pictureId = params['p']
        const dimension = params['d']
        if (!id && !pictureId && !dimension) {
          this.newPuzzle();
        } else if (this.type == 'picture' && pictureId && !id) {
          const puzzle = this.play.getNewPuzzle(this.type, [], this.dimension);
          puzzle.picture = pictureId;
          this.pictureId = pictureId;
          this.newPuzzle(puzzle);
        }
        else if (this.type == 'numeric' && dimension && !id) {
          const puzzle = this.play.getNewPuzzle(this.type, [], dimension);
          this.newPuzzle(puzzle);
        } else {
          this.getFromDb(this.type, id, pictureId);
        }
      })
    }, 100);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDownEvents = (event: KeyboardEvent) => {
    if (this.puzzle.solved) return true;
    switch (event.key) {
      case 'ArrowUp':
        this.handleInverseKeyPressed('up');
        return false;
      case 'ArrowDown':
        this.handleInverseKeyPressed('down');
        return false;
      case 'ArrowLeft':
        this.handleInverseKeyPressed('left');
        return false;
      case 'ArrowRight':
        this.handleInverseKeyPressed('right');
        return false;
      case 'Shift':
        this.showHint = true;
        return false;
      case 'p':
        if (this.puzzle.paused) {
          this.unPause();
        } else {
          this.pause();
        }
        return false
      case 'z':
        this.undo();
        return false;
      case 'r':
        this.redo();
        return false;
      default:
        return true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleUpDownEvents = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Shift':
        this.showHint = false;
        return false;
      default:
        return true;
    }
  }

  @HostListener('window:blur')
  handleWindowBlurEvent = () => {
    // this.pause();
  }

  newPuzzle = (puzzle?: Puzzle) => {
    if (!puzzle) {
      puzzle = this.play.getNewPuzzle(this.type, [], this.dimension);
      this.pictureId = puzzle.picture;
    }

    this.puzzle = puzzle;
    this.dimension = puzzle.dimension;
    this.timer = new Timer(puzzle.currentTime);
    if (!puzzle.solved && !puzzle.paused) {
      this.timer.start();
    }
    this.timer?.onTick(this.onTick);
    this.setQuery(this.puzzle);
  }

  onTick = () => {
    if (this.timer) {
      this.puzzle.currentTime = this.timer.getTime();
    }
  }

  reset = () => {
    this.play.reset(this.puzzle);
    this.timer = new Timer().onTick(this.onTick);
    if (!this.puzzle.paused) {
      this.timer.start();
    }
    this.save(this.puzzle);
  }

  handleMove = (number: number) => {
    if (this.puzzle.solved) {
      return;
    }
    this.play.move(this.puzzle, number);

    if (this.puzzle.solved) {
      this.timer?.stop();
      this.puzzle.solvedAt = new Date();
      this.puzzle.solveTime = this.timer?.getTime();
      this.snacksBar.open("solved", "x", {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5 * 1000
      });
    }
    this.save(this.puzzle);
  }

  pause = () => {
    this.puzzle.paused = true
    this.timer?.stop();
    this.save(this.puzzle);
  }

  unPause = () => {
    this.puzzle.paused = false;
    this.timer?.start();
    this.save(this.puzzle);
  }

  undo = () => {
    this.play.undo(this.puzzle)
    this.save(this.puzzle);
  }

  redo = () => {
    this.play.redo(this.puzzle)
    this.save(this.puzzle);
  }

  private getFromDb(type: PuzzleType, id: string, pictureId?: string) {
    this.storageService.get(type, id).subscribe(puzzle => {
      if (!puzzle) {
        const numbers = this.getNumbersFromQuery(id);
        puzzle = this.play.getNewPuzzle(this.type, numbers, undefined, pictureId);
      }
      this.newPuzzle(puzzle);
    })
  }

  // noinspection JSUnusedLocalSymbols
  private handleKeyPressed(direction: string) {
    const BLANK = this.puzzle.BLANK_TILE;
    const i = this.puzzle.currentMove.indexOf(BLANK);
    const d = this.puzzle.dimension;
    const row = Math.floor(i / d);
    const col = i % d;
    let pos;
    switch (direction) {
      case 'up':
        if (row === 0) return;
        pos = ((row - 1) * d) + col;
        break;
      case 'down':
        if (row === d - 1) return;
        pos = ((row + 1) * d) + col;
        break;
      case 'left':
        if (col === 0) return;
        pos = (row * d) + col - 1;
        break;
      case 'right':
        if (col === d - 1) return;
        pos = (row * d) + col + 1;
        break;
      default:
        return;
    }

    this.handleMove(this.puzzle.currentMove[pos]);
  }

  private handleInverseKeyPressed(direction: string) {
    const BLANK = this.puzzle.BLANK_TILE;
    const i = this.puzzle.currentMove.indexOf(BLANK);
    const d = this.puzzle.dimension;
    const row = Math.floor(i / d);
    const col = i % d;
    let pos;
    switch (direction) {
      case 'up':
        if (row === d - 1) return;
        pos = ((row + 1) * d) + col;
        break;
      case 'down':
        if (row === 0) return;
        pos = ((row - 1) * d) + col;
        break;
      case 'left':
        if (col === d - 1) return;
        pos = (row * d) + col + 1;
        break;
      case 'right':
        if (col === 0) return;
        pos = (row * d) + col - 1;
        break;
      default:
        return;
    }

    this.handleMove(this.puzzle.currentMove[pos]);
  }

  private setQuery(puzzle: Puzzle) {
    let queryParams;
    if (puzzle.type == 'picture') {
      queryParams = {p: puzzle.picture, n: puzzle.id}
    } else {
      queryParams = {n: puzzle.id}
    }
    this.router.navigate(
      [],
      {
        queryParams,
        relativeTo: this.route,
        queryParamsHandling: 'merge'
      }).then();
  }

  private getNumbersFromQuery(query: string): number[] {
    let numbers: number[] = [];
    const isValid = this.isQueryStringValid(query);

    if (isValid) {

      numbers = query.split(",")
        .map((d: string) => parseInt(d, 10))
        .filter((c: number) => !isNaN(c));
    }
    return numbers;
  }

  private isQueryStringValid(query: string): boolean {
    if (!query) {
      return false;
    }
    const numbers = query.split(",")
      .map((d: string) => parseInt(d, 10))
      .filter((c: number) => !isNaN(c));

    const dimension = Math.floor(Math.sqrt(numbers.length));
    if (dimension * dimension !== numbers.length) { // its not perfect square
      return false;
    }

    for (let i = 1; i <= dimension; i++) {
      if (numbers.indexOf(i) === -1) {
        return false;
      }
    }

    return true;
  }

  private save(puzzle: Puzzle) {
    this.storageService.savePuzzle(this.type, puzzle);
  }
}

