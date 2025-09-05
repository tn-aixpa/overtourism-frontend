import { Router } from "@angular/router";
import { NotificationService } from "../../../services/notifications.service";
import { ProblemService } from "../../../services/problem.service";
import { Component } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-problem-create',
  templateUrl: './problem-create.component.html',
  standalone: false,
  styleUrls: ['./problem-create.component.scss']
})
export class ProblemCreateComponent {
  availableCategories = [] as { key: string; label: string }[];
  model = {
    name: '',
    objective: '',
    descriptionProblem: '',
    categories: {} as Record<string, boolean>,
    resources: [] as string[]
  };

  newResource = '';
  saved = false;
  showProposalForm = false; 
  savedProblemId?: string;

  constructor(
    private svc: ProblemService,
    private router: Router,
    private notif: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.availableCategories = [
      { key: 'parcheggio', label: this.translate.instant('problems.fields.categories.parking') },
      { key: 'spiaggia', label: this.translate.instant('problems.fields.categories.beach') },
      { key: 'ristoranti', label: this.translate.instant('problems.fields.categories.restaurants') },
      { key: 'alberghi', label: this.translate.instant('problems.fields.categories.hotels') },
      { key: 'flussi', label: this.translate.instant('problems.fields.categories.flows') }
    ];
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
      const payload = {
        problem_name: this.model.name,
        problem_description: this.model.descriptionProblem,
        objective: this.model.objective,
        category: Object.keys(this.model.categories).filter(k => this.model.categories[k]),
        links: this.model.resources
      };

      const res: any = await this.svc.createProblem(payload).toPromise();

      // assuming res contains the new problem id
      const newProblemId = res?.id || res?.problem_id;

      if (!newProblemId) throw new Error('Problema creato ma impossibile recuperare ID');

      this.notif.showSuccess(this.translate.instant('problems.create_success'));
      
      // Redirect alla pagina dettaglio problema
      this.router.navigate(['/problems', newProblemId]);

    } catch (err: any) {
      this.notif.showError(err.message || this.translate.instant('problems.create_error'));
    }
  }

  cancel() {
    this.router.navigate(['/problems']);
  }
}
