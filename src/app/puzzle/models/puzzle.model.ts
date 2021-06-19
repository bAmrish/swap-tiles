export interface Puzzle {
  id: string;
  dimension: number;
  currentMove: number[];
  neighbours: Record<number, number[]>;
  moveHistory: number[][];
  redoStack: number[][];
  solved: boolean;
  totalMoves: number;
  BLANK_TILE: number;
  currentTime: number;
  paused: boolean;
  resetCounter: number;
  solveTime?: number;
  lastResetAt?: Date;
  createdAt: Date;
  solvedAt?: Date;
  type: PuzzleType;
  group?: string;
  order?: number;
}

export type PuzzleType = 'numeric' | 'picture';
