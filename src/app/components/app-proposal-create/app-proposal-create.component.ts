import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../services/notifications.service';
import { ProposalService } from '../../services/proposal.service';
import { Proposal, ProposalScenario } from '../../models/proposal.model';
import { Router } from '@angular/router';
import { ScenarioService } from '../../services/scenario.service';
import { ProblemScenario } from '../../models/scenario.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-proposal-create',
  standalone: false,
  templateUrl: './app-proposal-create.component.html',
  styleUrls: ['./app-proposal-create.component.scss']
})
export class ProposalCreateComponent {
  @Input() problemId!: string;
  @Output() proposalCreated = new EventEmitter<void>();
  @Input() proposalToEdit?: Proposal;

  model = {
    title: '',
    description: '',
    resources: [] as string[],
    contextConditions: '',
    potentialImpact: '',
    status: 'draft',
    related_scenarios: [] as ProposalScenario[]
  };

  newResource = '';
  scenarioInput = '';
  availableScenarios: ProposalScenario[] = [];


  
  // 🔹 Fonte per l’autocomplete
  scenarioSource = (query: string, populateResults: (results: string[]) => void) => {
    const filtered = this.availableScenarios
      .filter(s => s.scenario_name.toLowerCase().includes(query.toLowerCase()))
      .map(s => s.scenario_name);
    populateResults(filtered);
  };

  // 🔹 Quando selezioni uno scenario
  addScenario(scenarioName: string) {
    const scenario = this.availableScenarios.find(s => s.scenario_name === scenarioName);
    if (scenario && !this.model.related_scenarios.some(s => s.scenario_id === scenario.scenario_id)) {
      this.model.related_scenarios.push(scenario);
    }
  }

  removeScenario(scenario: { scenario_id: string; scenario_name: string }, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.model.related_scenarios = this.model.related_scenarios.filter(
      s => s.scenario_id !== scenario.scenario_id
    );
  }

  constructor(
    private proposalSvc: ProposalService,
    private notif: NotificationService,
    private scenarioSvc: ScenarioService,
    private translate: TranslateService
    

  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['problemId'] && this.problemId) {
      this.loadScenarios();
    }
  
    if (changes['proposalToEdit'] && this.proposalToEdit) {
      this.model = {
        title: this.proposalToEdit.proposal_title,
        description: this.proposalToEdit.proposal_description,
        resources: [...this.proposalToEdit.resources],
        contextConditions: this.proposalToEdit.contextConditions,
        potentialImpact: this.proposalToEdit.potentialImpact,
        status: this.proposalToEdit.status,
        related_scenarios: [...this.proposalToEdit.related_scenarios]
      };
    }
  }
  loadScenarios() {
    this.scenarioSvc.getScenariosByProblemId(this.problemId).subscribe({
      next: (scenarios: ProblemScenario[]) => {
        // mappiamo ProblemScenario → ProposalScenario
        this.availableScenarios = scenarios.map(s => ({
          scenario_id: s.id,
          scenario_name: s.name
        } as ProposalScenario));
      },
      error: (err) => {
        this.notif.showError(err?.message || 'Errore nel caricamento degli scenari');
      }
    });
  }
  addResource() {
    if (this.newResource.trim()) {
      this.model.resources.push(this.newResource.trim());
      this.newResource = '';
    }
  }

  removeResource(i: number) {
    this.model.resources.splice(i, 1);
  }


  isUrl(value: string): boolean {
    return value.startsWith('http://') || value.startsWith('https://');
  }

  async onSubmit() {
    try {
      if (!this.problemId) {
        this.notif.showError(this.translate.instant('problems.proposals.invalid_problem'));
        return;
      }
  
      const payload: Proposal = {
        proposal_id: this.proposalToEdit ? this.proposalToEdit.proposal_id : this.generateId(),
        proposal_title: this.model.title,
        proposal_description: this.model.description,
        resources: this.model.resources || [],
        contextConditions: this.model.contextConditions || '',
        potentialImpact: this.model.potentialImpact || '',
        status: this.model.status || 'draft',
        related_scenarios: this.model.related_scenarios || [],
        created: this.proposalToEdit ? this.proposalToEdit.created : new Date().toISOString(),
        updated: new Date().toISOString()
      };
  
      let res: any;
  
      if (this.proposalToEdit) {
        res = await this.proposalSvc
          .updateProposal(this.proposalToEdit.proposal_id, this.problemId, payload)
          .toPromise();
  
        this.notif.showSuccess(
          this.translate.instant('problems.proposals.update_success', { name: payload.proposal_title })
        );
      } else {
        res = await this.proposalSvc.createProposal(this.problemId, payload).toPromise();
  
        this.notif.showSuccess(
          this.translate.instant('problems.proposals.create_success', { name: payload.proposal_title })
        );
      }
  
      this.proposalCreated.emit();
    } catch (err: any) {
      this.notif.showError(
        this.translate.instant('problems.proposals.create_error', { name: this.model.title }) ||
        err?.message
      );
    }
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 12);
  }
}
