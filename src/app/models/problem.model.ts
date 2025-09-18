export interface Problem {
  problem_id: string;
  problem_name: string;
  problem_description: string;
  updated?: Date;
  created?: Date;
  objective?: string;
  groups?: string[];
  links?: string[];
  proposals?: any[];
  }

  export interface ProblemResponse {
    data: Array<{
      problem_id: string;
      problem_name: string;
      problem_description: string;
      updated?: string;
      created?: string;
      objective?: string;
      groups?: string[];
      links?: string[];
      proposals?: any[];
    }>;
  }