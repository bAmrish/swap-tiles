export interface Game {
  id: string;
  dimension: number;
  numbers: number[];
  neighbours: Record<number, number[]>;
  moves: number[][];
  won: boolean;
}
