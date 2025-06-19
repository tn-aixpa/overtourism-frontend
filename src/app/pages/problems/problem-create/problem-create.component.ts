import { Router } from "@angular/router";
import { NotificationService } from "../../../services/notifications.service";
import { ProblemService } from "../../../services/problem.service";
import { Component } from "@angular/core";

@Component({
  selector: 'app-problem-create',
  standalone: false,
  templateUrl: './problem-create.component.html',
  styleUrl: './problem-create.component.scss'
})
export class ProblemCreateComponent {
  
  model = {
    name: '',
    description: '',
    descriptionProblem:'',
    attrs: {} as Record<string,string>
  };

  // definisci qui la lista delle righe della tabella:
  attributes = [
    { key: 'deadline',   label: 'problems.fields.deadline'   },
    { key: 'owner',      label: 'problems.fields.owner'      },
    { key: 'priority',   label: 'problems.fields.priority'   },
    // … aggiungi le altre coppie attributo/chiave che ti servono
  ];

  constructor(private svc: ProblemService, private router: Router, private notif: NotificationService) {}

  onSubmit() {
    // this.svc.createProblem(this.model).subscribe({
    //   next: () => {
    //     this.notif.showSuccess('Problema creato con successo');
    //     this.router.navigate(['/problems']);
    //   },
    //   error: (err) => this.notif.showError(err.message || 'Errore creazione')
    // });
  }

  cancel() {
    this.router.navigate(['/problems']);
  }
}
