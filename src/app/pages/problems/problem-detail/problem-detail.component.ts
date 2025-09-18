import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../../../services/problem.service';
import { NotificationService } from '../../../services/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Proposal } from '../../../models/proposal.model';
import { ProposalService } from '../../../services/proposal.service';
import { ItModalComponent } from 'design-angular-kit';
import { Problem } from '../../../models/problem.model';

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

  @ViewChild('deleteProblemModal') deleteProblemModal!: ItModalComponent;
  @ViewChild('proposalModal') proposalModal!: ItModalComponent;
  @ViewChild('editProblemModal') editProblemModal!: ItModalComponent;

onProblemEdited(problem: Problem) {
  this.editProblemModal.hide();
  this.loadProblem(); // ricarica il dettaglio
}
  proposalToEdit?: Proposal;

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
  openProposalModal(): void {
    this.proposalToEdit = undefined;
    this.proposalModal.show();
  }
// modifica proposta 
editProposal(proposalId: string): void {
  const proposal = this.proposals.find(p => p.proposal_id === proposalId);
  if (proposal) {
    this.proposalToEdit = { ...proposal }; 
    this.proposalModal.show();
  }
}
onProposalCreatedModal(): void {
  this.proposalModal.hide();
  this.loadProblem(); // ricarica dati per aggiornare lista
}

onCancelProposal(): void {
  this.proposalModal.hide();
}
editProblem() {
  this.router.navigate(['/problems/create'], {
    queryParams: { edit: this.problemId }
  });
}

// Apri modal
openDeleteModal(event?: Event): void {
  if (event) event.stopPropagation();
  this.deleteProblemModal.toggle();
}
get modalTitle(): string {
  return this.proposalToEdit 
    ? this.translate.instant('proposals.edit_title') 
    : this.translate.instant('proposals.add_title');
}
// Annulla
onCancelDeleteProblem(): void {
  this.deleteProblemModal.hide();
}

// Conferma
onConfirmDeleteProblem(): void {
  if (!this.problemId) return;

  this.problemService.deleteProblem(this.problemId).subscribe({
    next: () => {
      this.deleteProblemModal.hide();

      // vai alla lista problemi (adatta la rotta al tuo routing)
      this.router.navigate(['/problems']);
    },
    error: (err) => {
      console.error('Errore durante eliminazione problema', err);
      this.deleteProblemModal.hide();
    }
  });
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
