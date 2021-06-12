import {Timer} from "src/app/shared/timer";

export interface Game {
  id: string;
  dimension: number;
  currentMove: number[];
  neighbours: Record<number, number[]>;
  moveHistory: number[][];
  redoStack: number[][];
  solved: boolean;
  totalMoves: number;
  BLANK_TILE: number;
  timer?: Timer;
  paused: boolean;
}
