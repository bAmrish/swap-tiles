import {Puzzle} from '../../puzzle/models/puzzle.model';

export class Stats {
  totalPuzzles = 0;
  totalSolved = 0;
  totalUnsolved = 0;
  averageTime = 0;
  averageMoves = 0;
  bestTime?: Puzzle;
  bestMove?: Puzzle;
}
