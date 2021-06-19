import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Puzzle} from '../../models/puzzle.model';

@Component({
  selector: "app-tile-container",
  templateUrl: "./tile-container.component.html",
  styleUrls: ["./tile-container.component.scss"]
})
export class TileContainerComponent implements OnChanges {
  // @ts-ignore
  @Input() puzzle: Puzzle;
  @Output() onMove = new EventEmitter<number>();
  @Output() onUnPause = new EventEmitter<boolean>();
  // @ts-ignore
  BLANK_TILE;

  onTileClick(event: number) {
    this.onMove.emit(event);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property == 'puzzle') {
        const puzzle: Puzzle = changes['puzzle'].currentValue;
        const dimension: number = puzzle.dimension;
        this.BLANK_TILE = dimension * dimension;
      }
    }
    this.BLANK_TILE = this.puzzle.dimension * this.puzzle.dimension;
  }

  onPauseClicked() {
    this.onUnPause.emit(true);
  }

}
