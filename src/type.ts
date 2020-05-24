export interface Coverage {
  total: number;
  paths: {
    path: string;
    value: number;
  }[];
}

export interface CoverageResult {
  statement: Coverage;
  // branch: Coverage;
  // function: Coverage;
}
