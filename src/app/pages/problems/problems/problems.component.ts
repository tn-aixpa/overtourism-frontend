import { Component } from '@angular/core';
import { Problem } from '../../../models/problem.model';
import { ProblemService } from '../../../services/problem.service';
import { of, delay } from 'rxjs';
import { NotificationService } from '../../../services/notifications.service';

@Component({
  selector: 'app-problems',
  standalone: false,
  templateUrl: './problems.component.html',
  styleUrl: './problems.component.scss'
})
export class ProblemsComponent {
  problems: Problem[] = [];
  loading = true;
  errorMessage = '';

  constructor(private problemService: ProblemService,
    private notificationService: NotificationService

  ) {}

  ngOnInit(): void {
    this.loadProblems();
  }

  loadProblems(): void {

    this.loading = true;
    this.errorMessage = ''; 
    this.problemService.getProblems().subscribe({
      next: (data) => {

        this.problems = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento problems', err);
        this.notificationService.showError(err.message || 'Errore sconosciuto.');
        this.loading = false;
      }
    });
  }
}
