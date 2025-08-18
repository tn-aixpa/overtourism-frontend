import { Component, ViewChild } from '@angular/core';
import { ScenarioService, Widget } from '../../../services/scenario.service';
import { Scenario } from '../../../models/scenario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ItModalComponent } from 'design-angular-kit';
import { NotificationService } from '../../../services/notifications.service';


@Component({
  selector: 'app-scenari',
  standalone: false,
  templateUrl: './scenari.component.html',
  styleUrl: './scenari.component.scss'
})
export class ScenariComponent {
  @ViewChild('deleteModal') deleteModal!: ItModalComponent;
  scenarioToDelete: Scenario | null = null;

  scenari: Scenario[] = [];
  loading = true;
  problemId: any;
  comparazioneAttiva = false;
  selectedScenari: any[] = [];
  widgets: any;

  constructor(
    private scenarioService: ScenarioService,
    private router: Router,
    private notificationService: NotificationService, 
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
  hasParams(scenario: any): boolean {
    return !!scenario.index_diffs && Object.keys(scenario.index_diffs).length > 0;
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
  getDiffDescription(scenario: any): string {
    if (!scenario.index_diffs) return '';
  
    const diffs = Object.entries(scenario.index_diffs).map(([key, value]) => {
      const name = this.getIndexNameFromKey(key);
      return `<div width="300px"><strong>${name}</strong>: ${value}</div>`;
    });
  
    return diffs.join('');
  }
  
  getIndexNameFromKey(key: string): string {
    if (!this.widgets) {
      return key; // fallback
    }
  
    for (const group of Object.keys(this.widgets)) {
      const widget = this.widgets[group].find((w: { index_id: string; }) => w.index_id === key);
      if (widget) return widget.index_name;
    }
    return key;
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
    this.loadWidgets();

  }
  loadWidgets() {
    this.scenarioService.getWidgets().subscribe({
      next: (data) => {
        const initialized = this.initializeWidgetBounds(data);
        this.widgets = initialized;
      },
      error: (err) => {
        console.error('Errore caricamento widget', err);
      }
    });
  }
    private initializeWidgetBounds(widgets: Record<string, Widget[]>): Record<string, Widget[]> {
      const clone = JSON.parse(JSON.stringify(widgets));
      for (const key of Object.keys(clone)) {
        for (const widget of clone[key]) {
          if (widget.scale && widget.index_category !== '%') {
            widget.vMin ??= widget.loc;
            widget.vMax ??= widget.loc + widget.scale;
          }
        }
      }
      return clone;
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
  // deleteScenario(scenario: Scenario): void {
  //   if (confirm(`Vuoi davvero eliminare lo scenario "${scenario.name}"?`)) {
  //     this.scenarioService.deleteScenario(scenario.id).subscribe({
  //       next: () => {
  //         this.scenari = this.scenari.filter(s => s.id !== scenario.id);
  //       },
  //       error: err => {
  //         console.error('Errore durante l\'eliminazione dello scenario', err);
  //         // eventualmente mostrare un messaggio all'utente
  //       }
  //     });
  //   }
  // }
  openDeleteModal(scenario: Scenario): void {
    this.scenarioToDelete = scenario;
    this.deleteModal.toggle();
  }

  onCancelDelete(): void {
    this.deleteModal.toggle();
    this.scenarioToDelete = null;
  }

  onConfirmDelete(): void {
    if (!this.scenarioToDelete) return;

    this.scenarioService.deleteScenario(this.scenarioToDelete.id, this.problemId).subscribe({
      next: () => {
        this.scenari = this.scenari.filter(s => s.id !== this.scenarioToDelete!.id);
        this.deleteModal.toggle();
        this.notificationService.showError('Scenario eliminato con successo');
        this.scenarioToDelete = null;
      },
      error: (err) => {
        this.notificationService.showError('Errore durante l\'eliminazione dello scenario');
        console.error('Errore durante l\'eliminazione dello scenario', err);
      }
    });
  }

}
