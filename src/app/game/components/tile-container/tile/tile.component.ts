import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: "app-tile",
  templateUrl: "./tile.component.html",
  styleUrls: ["./tile.component.scss"]
})
export class TileComponent {
  @Input() number: number = 0;
  @Output() tileClick = new EventEmitter<number>()

  onClick = () => {
    this.tileClick.emit(this.number);
  }

}
