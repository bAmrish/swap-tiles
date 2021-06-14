import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {StatsCardViewComponent} from './components/views/card/stats-card-view.component';
import {StatsTableViewComponent} from './components/views/table/stats-table-view.component';
import {StatsComponent} from './components/stats.component';

@NgModule({
  declarations: [StatsComponent, StatsCardViewComponent, StatsTableViewComponent],
  imports: [CommonModule, SharedModule, FormsModule]
})
export class StatsModule {
}
