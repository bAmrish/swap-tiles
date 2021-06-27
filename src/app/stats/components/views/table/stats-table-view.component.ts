import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {DateTime} from 'luxon';
import {Puzzle} from '../../../../puzzle/models/puzzle.model';
import {Stats} from '../../../models/stats.model';


@Component({
  selector: 'app-stats-table-view',
  templateUrl: './stats-table-view.component.html',
  styleUrls: ['./stats-table-view.component.scss']
})
export class StatsTableViewComponent implements OnChanges {
  @Input() overallStats: Stats = new Stats();
  @Input() dimArray: { dim: number, stats: Stats }[] = [];
  @Input() puzzles: Puzzle[] = [];
  puzzleDatasource = new MatTableDataSource<Puzzle>();
  dt = DateTime;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  // @ts-ignore
  @ViewChild("summaryTable") summaryTable: MatTable<{ dim: number, stats: Stats }>;
  summaryColumns = ['size', 'totalPuzzles', 'totalSolved', 'totalUnsolved', 'bestTime', 'averageTime', 'bestMoves', 'averageMoves']
  puzzleColumns = ['size', 'type', 'id', 'createdAt', 'solved', 'moves', 'time', 'solvedAt'];

  ngOnChanges(changes: SimpleChanges) {
    if (this.dimArray.length > 0) {
      this.dimArray = this.dimArray.slice(0).filter(a => a.dim != -1);
      this.dimArray.push({dim: -1, stats: this.overallStats});
      if (this.summaryTable) {
        this.summaryTable.renderRows();
      }
    }

    if (this.puzzles.length) {
      this.puzzleDatasource.data = this.puzzles.slice(0)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      this.puzzleDatasource.paginator = this.paginator;
      // this.paginator?.pageSize = 10
    }
  }

  filter(dim: number | 'all', type: string): Puzzle[] {
    let dimFilteredPuzzles = this.puzzles.slice(0);
    let filteredPuzzles: Puzzle[];

    if (dim !== 'all') {
      const dimension: number = dim;
      dimFilteredPuzzles = this.puzzles.filter(a => a.dimension === dimension);
    }

    switch (type) {
      case 'solved':
        filteredPuzzles = dimFilteredPuzzles.filter(a => a.solved);
        break
      case 'unsolved':
        filteredPuzzles = dimFilteredPuzzles.filter(a => !a.solved);
        break;
      default:
        filteredPuzzles = dimFilteredPuzzles;
    }
    this.puzzleDatasource.data = filteredPuzzles
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return filteredPuzzles;
  }
}
