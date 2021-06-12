import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: "app-tile-container",
  templateUrl: "./tile-container.component.html",
  styleUrls: ["./tile-container.component.scss"]
})
export class TileContainerComponent implements OnChanges {
  @Input() numbers: number[] = [];
  @Input() disable = false;
  @Input() dimension: number = 3;
  @Input() paused = true;
  @Output() onMove = new EventEmitter<number>();
  @Output() onUnPause = new EventEmitter<boolean>();
  BLANK_TILE = this.dimension * this.dimension;

  onTileClick(event: number) {
    this.onMove.emit(event);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property == 'dimension') {
        const dimension: number = changes['dimension'].currentValue;
        this.BLANK_TILE = dimension * dimension;
      }
    }
    this.BLANK_TILE = this.dimension * this.dimension;
  }

  onPauseClicked() {
    this.onUnPause.emit(true);
  }

}
