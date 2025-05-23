import { Component } from '@angular/core';
import { ScenarioService } from '../../../services/scenario.service';
import { Scenario } from '../../../models/scenario.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scenari',
  standalone: false,
  templateUrl: './scenari.component.html',
  styleUrl: './scenari.component.scss'
})
export class ScenariComponent {
  scenari: Scenario[] = [];
  loading = true;
  simulationId: any;
  comparazioneAttiva = false;
  selectedScenari: any[] = [];
  constructor(private scenarioService: ScenarioService,private route: ActivatedRoute) {}
  toggleComparazione() {
    this.comparazioneAttiva = !this.comparazioneAttiva;
    if (!this.comparazioneAttiva) {
      this.selectedScenari = [];
    }
  }
  
  isScenarioSelected(scenario: any): boolean {
    return this.selectedScenari.some(s => s.id === scenario.id);
  }
  
  checkboxStates: { [id: string]: boolean } = {};

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
    // Implementa la logica di confronto (es: naviga a una pagina di confronto)
    // Esempio:
    // this.router.navigate(['/simulazioni', simulationId, 'confronta', selectedScenari[0].id, selectedScenari[1].id]);
    alert('Confronto tra: ' + this.selectedScenari.map(s => s.name).join(' e '));
  }
  ngOnInit(): void {
    this.simulationId = this.route.snapshot.paramMap.get('simulationId')!;

    this.loadScenarios();
  }

  loadScenarios(): void {
    this.loading = true;
    this.scenarioService.getScenarios().subscribe({
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
}
