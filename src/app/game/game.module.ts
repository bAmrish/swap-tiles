import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GameComponent} from './components/game.component';
import {TileContainerComponent} from './components/tile-container/tile-container.component';
import {BlankTileComponent} from './components/tile-container/tile/blank-tile.component';
import {TileComponent} from './components/tile-container/tile/tile.component';

@NgModule({
  declarations: [GameComponent, TileContainerComponent, TileComponent, BlankTileComponent],
  imports: [CommonModule, FormsModule]
})
export class GameModule {
}
