export interface DataFact {
    category: string;
    violations_percentage: number;
    uncertainty: number;
    violations_numerosity?: number;
    parameter?: string;
    original_value?: any;
    new_value?: any;
    variation?: string;
    violations_percentage_old?: number;
    data_fact1?: DataFact;
  }