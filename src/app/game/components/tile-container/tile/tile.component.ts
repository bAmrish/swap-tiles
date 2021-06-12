import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: "app-tile",
  templateUrl: "./tile.component.html",
  styleUrls: ["./tile.component.scss"]
})
export class TileComponent {
  @Input() number: number = 0;
  @Input() disable = false;
  @Output() tileClick = new EventEmitter<number>()
  @Input() paused = false;
  onClick = () => {
    this.tileClick.emit(this.number);
  }

}
