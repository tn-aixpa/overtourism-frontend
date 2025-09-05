import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../../../services/problem.service';
import { NotificationService } from '../../../services/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Proposal } from '../../../models/proposal.model';
import { ProposalService } from '../../../services/proposal.service';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  standalone: false,
  styleUrls: ['./problem-detail.component.scss']
})
export class ProblemDetailComponent implements OnInit {
  problemId!: string;
  problem: any = null;
  proposals: Proposal[] = [];
  showProposalForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private problemService: ProblemService,
    private notif: NotificationService,
    private translate: TranslateService,
    private proposalService: ProposalService
  ) {}

  ngOnInit() {
    this.problemId = this.route.snapshot.paramMap.get('problemId')!;
    this.loadProblem();
  }
  onProposalCreated() {
    this.showProposalForm = false;   
    this.loadProblem();             
  }
  // elimina proposta
  removeProposal(proposalId: string) {
    if (!this.problemId) return;
  
    this.proposalService.deleteProposal(proposalId, this.problemId).subscribe({
      next: () => {
        this.notif.showSuccess('Proposta eliminata con successo');
        // Aggiorna la lista senza ricaricare tutta la pagina
        this.proposals = this.proposals.filter(p => p.proposal_id !== proposalId);
      },
      error: (err) => {
        this.notif.showError(err?.message || 'Errore durante l\'eliminazione della proposta');
      }
    });
  }
// modifica proposta 
editProposal(proposalId: string) {
  const proposalToEdit = this.proposals.find(p => p.proposal_id === proposalId);
  if (proposalToEdit) {
    this.showProposalForm = true;
    // Passa i dati al form di creazione/modifica
    // es: this.proposalForm.model = {...proposalToEdit};
  }
}
  loadProblem() {
    this.problemService.getProblemById(this.problemId).subscribe({
      next: (res) => {
        this.problem = res;

        if (res.proposals?.length) {
          this.proposals = res.proposals.map((p: any) => ({
            proposal_id: p.proposal_id,
            problem_id: res.problem_id,
            proposal_title: p.proposal_title || 'Proposal',
            proposal_description: p.proposal_description || '',
            resources: p.data || [],
            contextConditions: p.context || '',
            potentialImpact: p.impact || '',
            status: p.status || 'draft',
            related_scenarios: (p.related_scenarios || []).map((s: any) => ({
              scenario_id: s.scenario_id,
              scenario_name: s.scenario_name
            })),
            created: p.created,
            updated: p.updated
          }));
        }
        
      },
      error: (err) => this.notif.showError(err.message || this.translate.instant('problems.load_error'))
    });
  }

  toggleProposalForm() {
    this.showProposalForm = !this.showProposalForm;
  }

  back() {
    this.router.navigate(['/problems']);
  }
}
