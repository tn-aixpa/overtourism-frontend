export interface ProblemScenario {
    id: string;
    name: string;
    description?: string;
    index_diffs?: { [key: string]: number };
  }