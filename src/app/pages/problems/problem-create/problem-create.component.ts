import { Router } from "@angular/router";
import { NotificationService } from "../../../services/notifications.service";
import { ProblemService } from "../../../services/problem.service";
import { Component } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-problem-create',
  standalone: false,
  templateUrl: './problem-create.component.html',
  styleUrl: './problem-create.component.scss'
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
  showProposals = false; 
  savedProblemId?: string; 
  showProposalForm = false;

  
  constructor(
    private svc: ProblemService,
    private router: Router,
    private notif: NotificationService,
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.availableCategories = [
      { key: 'parcheggio', label: this.translate.instant('problems.fields.categories.parking') },
      { key: 'spiaggia',   label: this.translate.instant('problems.fields.categories.beach') },
      { key: 'ristoranti', label: this.translate.instant('problems.fields.categories.restaurants') },
      { key: 'alberghi',   label: this.translate.instant('problems.fields.categories.hotels') }
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
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
  async onSubmit() {
    try {


      this.saved = true;       // disabilita gli input
      this.showProposals = true; // mostra il pulsante aggiungi proposta

      this.notif.showSuccess('Problema creato con successo');
    } catch (err: any) {
      this.notif.showError(err.message || 'Errore creazione');
    }
  }

  cancel() {
    this.router.navigate(['/problems']);
  }
}
