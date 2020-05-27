export interface Coverage {
  total: number;
  paths: {
    path: string;
    value: number;
  }[];
}

export interface CoverageSet {
  statement: Coverage;
  branch: Coverage;
  function: Coverage;
}
