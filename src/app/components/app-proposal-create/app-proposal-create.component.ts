import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-create',
  standalone: false,
  templateUrl: './app-proposal-create.component.html',
  styleUrls: ['./app-proposal-create.component.scss']
})
export class ProposalCreateComponent {
  @Input() problemId!: number;

  model = {
    title: '',
    description: '',
    resources: [] as string[],
    contextConditions: '',
    potentialImpact: '',
    status: [] as { label: string, color: string }[],
    scenarios: [] as string[]
  };

  newResource = '';
  scenarioInput = '';
  availableScenarios = ['Scenario A', 'Scenario B', 'Scenario C']; 

  addResource() {
    if (this.newResource.trim()) {
      this.model.resources.push(this.newResource.trim());
      this.newResource = '';
    }
  }
  scenarioSource = (query: string, populateResults: (results: string[]) => void) => {
    const filtered = this.availableScenarios.filter(s =>
      s.toLowerCase().includes(query.toLowerCase())
    );
    populateResults(filtered);
  };
  
  removeResource(i: number) {
    this.model.resources.splice(i, 1);
  }

  addScenario(scenario: string) {
    if (!this.model.scenarios.includes(scenario)) {
      this.model.scenarios.push(scenario);
      this.scenarioInput = '';
    }
  }

  removeScenario(scenario: string) {
    this.model.scenarios = this.model.scenarios.filter(s => s !== scenario);
  }

  isUrl(value: string): boolean {
    return value.startsWith('http://') || value.startsWith('https://');
  }

  onSubmit() {
    console.log('Proposal saved', this.model);
    // Chiamata API per salvare proposta legata a this.problemId
  }
}
