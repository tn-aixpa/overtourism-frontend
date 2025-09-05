import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../../../services/problem.service';
import { NotificationService } from '../../../services/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Proposal } from '../../../models/proposal.model';

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
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.problemId = this.route.snapshot.paramMap.get('problemId')!;
    this.loadProblem();
  }
  onProposalCreated() {
    this.showProposalForm = false;   
    this.loadProblem();             
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
