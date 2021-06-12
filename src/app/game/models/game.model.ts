export interface Game {
  id: string;
  dimension: number;
  currentMove: number[];
  neighbours: Record<number, number[]>;
  moveHistory: number[][];
  solved: boolean;
  totalMoves: number;
}
