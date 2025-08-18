import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlotService } from '../../../services/plot.service';
import { ScenarioService } from '../../../services/scenario.service';
import { Scenario } from '../../../models/scenario.model';
import { PlotComponent } from '../../../components/plot/plot.component';
import { ItModalComponent } from 'design-angular-kit';

@Component({
  selector: 'app-scenario-detail',
  standalone: false,
  templateUrl: './scenario-detail.component.html',
  styleUrl: './scenario-detail.component.scss'
})
export class ScenarioDetailComponent  {
  @ViewChild('plotContainer') plotContainer!: ElementRef<HTMLDivElement>;
  @ViewChild(PlotComponent) plotComponent!: PlotComponent;
  @ViewChild('deleteModal') deleteModal!: ItModalComponent;

  scenarioId!: string;
  problemId!: string;
  scenario?: Scenario;

  constructor(
    private route: ActivatedRoute,
    private scenarioService: ScenarioService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.problemId = this.route.snapshot.paramMap.get('problemId')!;
    this.scenarioId = this.route.snapshot.paramMap.get('scenarioId')!;
    this.loadScenarioDetails();
  }
  canDeactivate(): Promise<boolean> | boolean {
    // Se il plotComponent esiste, delega a lui
    return this.plotComponent?.canDeactivate() ?? true;
  }
  loadScenarioDetails(): void {
    this.scenarioService.getScenariosByProblemId(this.problemId).subscribe({
      next: (scenarios) => {
        this.scenario = scenarios.find(s => s.id === this.scenarioId);
      }
    });
  }
  openDeleteModal(): void {
    this.deleteModal.toggle();
  }

  onCancelDelete(): void {
    this.deleteModal.hide();
  }

  confirmDelete(): void {
    this.scenarioService.deleteScenario(this.scenarioId, this.problemId).subscribe({
      next: () => {
        this.deleteModal.hide();
        this.router.navigate(['/problems', this.problemId, 'scenari']);
      },
      error: (err) => {
        console.error('Errore durante la cancellazione dello scenario', err);
        this.deleteModal.hide();
        alert('Si è verificato un errore durante la cancellazione.');
      }
    });
  }
}
