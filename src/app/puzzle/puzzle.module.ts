import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {PuzzleComponent} from './components/puzzle.component';
import {TileContainerComponent} from './components/tile-container/tile-container.component';
import {BlankTileComponent} from './components/tile-container/tile/blank-tile.component';
import {PictureTileComponent} from './components/tile-container/tile/picture-tile.component';
import {TileComponent} from './components/tile-container/tile/tile.component';

@NgModule({
  declarations: [
    PuzzleComponent, TileContainerComponent,
    TileComponent, BlankTileComponent, PictureTileComponent],
  imports: [CommonModule, FormsModule, SharedModule]
})
export class PuzzleModule {
}
