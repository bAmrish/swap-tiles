import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: "app-tile-container",
  templateUrl: "./tile-container.component.html",
  styleUrls: ["./tile-container.component.scss"]
})
export class TileContainerComponent {
  @Input() numbers: number[] = [];
  @Output() onMove = new EventEmitter<number>();
  BLANK_TILE = 9;

  onTileClick(event: number) {
    this.onMove.emit(event);
  }
}
