import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameComponent} from './game/components/game.component';

const ROUTES: Routes = [
  {
    path: 'game',
    component: GameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
