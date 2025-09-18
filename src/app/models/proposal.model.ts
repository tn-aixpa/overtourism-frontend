export interface ProposalScenario {
  scenario_id: string;
  scenario_name: string;
  }
  
  export interface Proposal {
    proposal_id: string;
    problem_id?: string;
    proposal_title: string;
    proposal_description: string;
    resources: string[];
    contextConditions: string;
    potentialImpact: string;
    status: string;
    related_scenarios: ProposalScenario[];
    created: string;
    updated: string;
  }
  