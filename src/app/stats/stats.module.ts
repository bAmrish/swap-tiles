import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {StatsComponent} from './components/stats.component';

@NgModule({
  declarations: [StatsComponent],
  imports: [SharedModule]
})
export class StatsModule{}
