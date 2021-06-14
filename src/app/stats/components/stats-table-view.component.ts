import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material/table';
import {Stats} from '../models/stats.model';

@Component({
  selector: 'app-stats-table-view',
  templateUrl: './stats-table-view.component.html',
  styleUrls: ['./stats-table-view.component.scss']
})
export class StatsTableViewComponent implements OnChanges {
  @Input() overallStats: Stats = new Stats();
  @Input() dimArray: { dim: number, stats: Stats }[] = [];
  // @ts-ignore
  @ViewChild(MatTable) table: MatTable<{ dim: number, stats: Stats }>;
  displayColumns = ['size', 'totalPuzzles', 'totalSolved', 'totalUnsolved', 'bestTime', 'averageTime', 'bestMoves', 'averageMoves']

  ngOnChanges(changes: SimpleChanges) {
    if (this.dimArray.length > 0) {
      this.dimArray = this.dimArray.slice(0).filter(a => a.dim != -1);
      this.dimArray.push({dim: -1, stats: this.overallStats});
      if (this.table) {
        this.table.renderRows();
      }
    }
  }

}
