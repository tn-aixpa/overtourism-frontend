import { Component } from '@angular/core';
import { ScenarioService } from '../../../services/scenario.service';
import { Scenario } from '../../../models/scenario.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-scenari',
  standalone: false,
  templateUrl: './scenari.component.html',
  styleUrl: './scenari.component.scss'
})
export class ScenariComponent {
  scenari: Scenario[] = [];
  loading = true;
  problemId: any;
  comparazioneAttiva = false;
  selectedScenari: any[] = [];

  constructor(
    private scenarioService: ScenarioService,
    private router: Router,
    private route: ActivatedRoute) { }
  toggleComparazione() {
    this.comparazioneAttiva = !this.comparazioneAttiva;
    if (!this.comparazioneAttiva) {
      this.selectedScenari = [];
    }
  }
  openEdit(scenario: any) {
    //
    alert('Vado allEdit di: ' + scenario.name);

  }
  isScenarioSelected(scenario: any): boolean {
    return this.selectedScenari.some(s => s.id === scenario.id);
  }

  checkboxStates: { [id: string]: boolean } = {};
  goToScenario(scenario: Scenario): void {
    if (this.comparazioneAttiva) return; // Se la comparazione è attiva, non navigare
    this.router.navigate(['/problems', this.problemId, 'scenari', scenario.id]);
  }
  onScenarioCheck(scenario: any, checked: boolean) {
    if (checked) {
      if (this.selectedScenari.length < 2 && !this.isScenarioSelected(scenario)) {
        this.selectedScenari.push(scenario);
      } else {
        // Se sono già 2, non accettare altri
        this.checkboxStates[scenario.id] = false;
      }
    } else {
      this.selectedScenari = this.selectedScenari.filter(s => s.id !== scenario.id);
    }
  }

  confrontaScenari() {
    const [s1, s2] = this.selectedScenari;
    this.router.navigate([
      '/problems',
      this.problemId,
      'scenari',
      'confronta',
      s1.id,
      s2.id
    ]);
  }
  ngOnInit(): void {
    this.problemId = this.route.snapshot.paramMap.get('problemId')!;

    this.loadScenarios(this.problemId);
  }

  loadScenarios(problemId: any): void {
    // this.loading = true;
    // this.scenari=this.mockScenarios;
    // this.loading = false;
    this.loading = true;
    this.scenarioService.getScenariosByProblemId(problemId).subscribe({
      next: (data) => {
        this.scenari = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento scenari', err);
        this.loading = false;
      }
    });
  }
  deleteScenario(scenario: Scenario): void {
    if (confirm(`Vuoi davvero eliminare lo scenario "${scenario.name}"?`)) {
      this.scenarioService.deleteScenario(scenario.id).subscribe({
        next: () => {
          this.scenari = this.scenari.filter(s => s.id !== scenario.id);
        },
        error: err => {
          console.error('Errore durante l\'eliminazione dello scenario', err);
          // eventualmente mostrare un messaggio all'utente
        }
      });
    }
  }
}
