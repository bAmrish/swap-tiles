import {Component, OnInit} from '@angular/core';
import {Puzzle} from '../../puzzle/models/puzzle.model';
import {Stats} from '../models/stats.model';
import {StatsService} from '../services/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  viewMode = "table-view";
  puzzles: Puzzle[] = [];
  overallStats: Stats = new Stats();
  dimArray: { dim: number, stats: Stats }[] = [];

  constructor(private statsService: StatsService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.statsService.getAllPuzzles().subscribe(puzzles => {
        this.puzzles = puzzles;
        this.calculateStats();
      });
    }, 1000);
  }

  calculateStats() {
    const dimMap: Record<number, Puzzle[]> = {};
    this.puzzles.forEach(puzzle => {
      dimMap[puzzle.dimension] = dimMap[puzzle.dimension] || [];
      dimMap[puzzle.dimension].push(puzzle)
    });
    this.overallStats = this.getStats(this.puzzles);
    for (let dimension in dimMap) {
      // noinspection JSUnfilteredForInLoop
      const dim = parseInt(dimension);
      const puzzles = dimMap[dim];
      const stats = this.getStats(puzzles);
      const dimStat: { dim: number, stats: Stats } = {dim, stats};

      this.dimArray.push(dimStat);
    }
  }

  // noinspection JSMethodCanBeStatic
  private getStats(puzzles: Puzzle[]): Stats {
    const solvedPuzzles = puzzles.filter(p => p.solved);
    const totalPuzzles = puzzles.length;
    const totalSolved = solvedPuzzles.length;
    const totalUnsolved = totalPuzzles - totalSolved;
    let bestTime;
    let bestMove;
    let averageTime = 0;
    let averageMoves = 0;
    if (solvedPuzzles.length == 1) {
      bestTime = solvedPuzzles[0];
      bestMove = solvedPuzzles[0];
      averageTime = solvedPuzzles[0].solveTime || 0;
      averageMoves = solvedPuzzles[0].totalMoves || 0;
    } else if (solvedPuzzles.length > 1) {
      bestTime = solvedPuzzles.sort(
        // @ts-ignore
        (a, b) => a.solveTime - b.solveTime
      )[0];

      bestMove = solvedPuzzles.sort(
        // @ts-ignore
        (a, b) => a.totalMoves - b.totalMoves
      )[0];

      const totalTime = solvedPuzzles.reduce((total, a) => (a.solveTime || 0) + total, 0);
      averageTime = Math.round(totalTime/solvedPuzzles.length);

      const totalMoves = solvedPuzzles.reduce((total, a) => (a.totalMoves || 0) + total, 0);
      averageMoves = Math.round(totalMoves/solvedPuzzles.length);
    }
    return {totalPuzzles, totalSolved, totalUnsolved, bestTime, bestMove, averageTime, averageMoves};
  }
}
