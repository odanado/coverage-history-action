export interface Position {
  line: number;
  column: number;
}

export interface Location {
  start: Position;
  end: Position;
}

export interface StatementMap {
  [index: string]: Location;
}

export interface FnMap {
  [index: string]: {
    name: string;
    decl: Location;
    loc: Location;
  };
}

export interface BranchMap {
  [inedx: string]: {
    loc: Location;
    type: string;
    locations: Location[];
  };
}

export interface Coverage {
  [path: string]: {
    path: string;
    statementMap: StatementMap;
    fnMap: FnMap;
    branchMap: BranchMap;
    s: {
      [index: string]: number;
    };
    f: {
      [index: string]: number;
    };
    b: {
      [index: string]: [number, number];
    };
  };
}
