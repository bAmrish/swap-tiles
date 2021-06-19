import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: "app-tile",
  templateUrl: "./tile.component.html",
  styleUrls: ["./tile.component.scss"]
})
export class TileComponent {
  @Input() dimension: number = 0;
  @Input() number: number = 0;
  @Input() disable = false;
  @Output() tileClick = new EventEmitter<number>()
  @Input() paused = false;
  @Input() blank = false;
  @Input() pictureId? = "1";
  @Input() type: 'numeric' | 'picture' = 'numeric';

  onClick = () => {
    this.tileClick.emit(this.number);
  }
}
