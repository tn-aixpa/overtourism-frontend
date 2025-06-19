import { Component } from '@angular/core';
import { Problem } from '../../../models/problem.model';
import { ProblemService } from '../../../services/problem.service';
import { of, delay, Observable } from 'rxjs';
import { NotificationService } from '../../../services/notifications.service';
import { SearchItem } from 'design-angular-kit';
import { Router } from '@angular/router';

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
    private notificationService: NotificationService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.loadProblems();
  }

    searchProblems$: (search?: string | null | undefined) => Observable<Array<SearchItem>> = (search) => {
      if (!search) {
      return of([]);
    }

    return of(this.problems.map(problem => ({
      value: problem.id, // Assuming 'id' is a unique identifier in Problem
      label: problem.name // Assuming 'name' is a property in Problem for display
    })));
  };

  // searchProblems$ = (search?: string): Observable<Array<SearchItem>> => {
  //   if (!search) {
  //     return of([]);
  //   }

  //   // API request for retrieve data, use `search` to filter data
  //   return of(this.problems.map(problem => ({
  //     value: problem.id, // Assuming 'id' is a unique identifier in Problem
  //     label: problem.name // Assuming 'name' is a property in Problem for display
  //   })));
  // };

  onSearchSelected(item: SearchItem): void {
    this.router.navigate(['/problems', item.value, 'scenari']);
    
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
