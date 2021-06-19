export interface Puzzle {
  id: string;
  type: PuzzleType;
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
  picture?: string;
}

export type PuzzleType = 'numeric' | 'picture';
