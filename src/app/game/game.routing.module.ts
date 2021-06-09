import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameComponent} from './components/game.component';

const ROUTES: Routes = [
  {path: '', component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class GameRoutingModule {}
