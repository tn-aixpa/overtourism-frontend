import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../../../services/notifications.service";
import { ProblemService } from "../../../services/problem.service";
import { Component } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { Proposal } from "../../../models/proposal.model";
import { Problem } from "../../../models/problem.model";

@Component({
  selector: 'app-problem-create',
  templateUrl: './problem-create.component.html',
  standalone: false,
  styleUrls: ['./problem-create.component.scss']
})
export class ProblemCreateComponent {
  availableGroups = [] as { key: string; label: string }[];
  model = {
    name: '',
    objective: '',
    descriptionProblem: '',
    groups: {} as Record<string, boolean>,
    resources: [] as string[]
  };
  proposals: Proposal[] = [];
  newResource = '';
  showProposalForm = false; 
  savedProblemId?: string;
  editProblemId?: string;

  constructor(
    private svc: ProblemService,
    private router: Router,
    private notif: NotificationService,
    private translate: TranslateService,
    private route: ActivatedRoute

  ) {}

  ngOnInit() {
    this.availableGroups = [
      { key: 'parcheggio', label: this.translate.instant('problems.fields.categories.parking') },
      { key: 'spiaggia', label: this.translate.instant('problems.fields.categories.beach') },
      { key: 'ristoranti', label: this.translate.instant('problems.fields.categories.restaurants') },
      { key: 'alberghi', label: this.translate.instant('problems.fields.categories.hotels') },
      { key: 'flussi', label: this.translate.instant('problems.fields.categories.flows') }
    ];
    this.editProblemId = this.route.snapshot.queryParamMap.get('edit') || undefined;
    if (this.editProblemId) {
      this.loadProblem(this.editProblemId);
    }
  }
  loadProblem(problemId: string) {
    this.svc.getProblemById(problemId).subscribe({
      next: (res: any) => {
        this.savedProblemId = res.problem_id;
        this.model.name = res.problem_name;
        this.model.objective = res.objective;
        this.model.descriptionProblem = res.problem_description;
        this.model.resources = res.links || [];
        this.proposals = res.proposals || [];
  
        // inizializza tutte le chiavi a false
        this.model.groups = {};
        this.availableGroups.forEach(g => this.model.groups[g.key] = false);
  
        // setta a true quelle presenti nel problema
        (res.groups || []).forEach((g: string) => {
          if (this.model.groups.hasOwnProperty(g)) {
            this.model.groups[g] = true;
          }
        });
      },
      error: (err) => this.notif.showError(err?.message || this.translate.instant('problems.load_error'))
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

  isUrl(str: string): boolean {
    try { new URL(str); return true; } catch { return false; }
  }

  async onSubmit() {
    try {

      const payload: Problem = {
        problem_id: this.savedProblemId!, 
        problem_name: this.model.name,
        problem_description: this.model.descriptionProblem,
        objective: this.model.objective,
        updated: new Date(),
        groups: Object.keys(this.model.groups).filter(k => this.model.groups[k]),
        links: this.model.resources,
        proposals: this.proposals
      };

      if (this.editProblemId) {
        // aggiornamento
        await this.svc.updateProblem(this.editProblemId, payload).toPromise();
        this.notif.showSuccess(this.translate.instant('problems.update_success'));
      } else {
        // creazione
        const res: any = await this.svc.createProblem(payload).toPromise();
        this.savedProblemId = res?.problem_id;
        this.notif.showSuccess(this.translate.instant('problems.create_success'));
      }

      this.router.navigate(['/problems', this.savedProblemId]);
    } catch (err: any) {
      this.notif.showError(err?.message || this.translate.instant('problems.create_error'));
    }
  }

  cancel() {
    this.router.navigate(['/problems']);
  }
}
