import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {StatsCardViewComponent} from './components/stats-card-view.component';
import {StatsTableViewComponent} from './components/stats-table-view.component';
import {StatsComponent} from './components/stats.component';

@NgModule({
  declarations: [StatsComponent, StatsCardViewComponent, StatsTableViewComponent],
  imports: [CommonModule, SharedModule]
})
export class StatsModule {
}
