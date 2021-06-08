import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {TileContainerComponent} from './tile-container/tile-container.component';
import {BlankTileComponent} from './tile/blank-tile.component';
import {TileComponent} from './tile/tile.component';

@NgModule({
  declarations: [
    AppComponent, TileComponent, TileContainerComponent, BlankTileComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
