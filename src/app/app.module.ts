import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {GameComponent} from './game/game.component';
import {TileContainerComponent} from './tile-container/tile-container.component';
import {BlankTileComponent} from './tile/blank-tile.component';
import {TileComponent} from './tile/tile.component';

@NgModule({
  declarations: [
    AppComponent, GameComponent, TileContainerComponent, TileComponent, BlankTileComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
