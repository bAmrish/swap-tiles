import {Component, Input} from '@angular/core';
import {Stats} from '../../../models/stats.model';

@Component({
  selector: 'app-stats-card-view',
  templateUrl: './stats-card-view.component.html',
  styleUrls: ['./stats-card-view.component.scss']
})
export class StatsCardViewComponent {
  @Input() overallStats: Stats = new Stats();
  @Input() dimArray: { dim: number, stats: Stats }[] = [];
}
