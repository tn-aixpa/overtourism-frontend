// plot.component.ts
import { Component, ElementRef, AfterViewInit, ViewChild, Input } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { PlotService } from '../../services/plot.service';
import { Curve, KPIs, PlotInput } from '../../models/plot.model';
import {
  SUBSYSTEM_OPTIONS
} from './plot.config';
import { ScenarioService, Widget } from '../../services/scenario.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../services/notifications.service';
import { Router } from '@angular/router';
import { ItModalComponent } from 'design-angular-kit';
@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  standalone: false,
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements AfterViewInit {

  @ViewChild('chartLib', { static: false }) chartLib!: ElementRef<HTMLElement>;
  @ViewChild('saveModal') saveModal!: ItModalComponent;

  @Input() editing: boolean = false;
  @Input() scenarioId!: string;
  @Input() problemId!: string;


  inputData: PlotInput | null = null;
  sottosistemaSelezionato = 'default';
  loading = true;
  selectOptions: Array<{ value: string; text: string }> = [{ value: 'default', text: 'Default' }];
  // heatmapAttiva = true;
  // showAllSubsystems = true;
  monoDimensionale = false;
  kpisData: KPIs | undefined;
  noteUtente: string = '';
  originalWidgets: Record<string, Widget[]> = {};
  widgets: Record<string, Widget[]> = {};
  sottosistemi = SUBSYSTEM_OPTIONS;
  editableIndexes: string[] = [];
  objectKeys = Object.keys;

  // editSidebarVisible = false;
  selectedScenario: any = null;
  isEditing: boolean = false;
  showControls: boolean = false; // per 'settings'
  hasChanges: boolean = false;
  changedWidgets!: Record<string, number | [number, number]>;
  indexDiffs: Record<string, number> = {};
  titolo: string = '';
  descrizione: string = '';
  //widget diversi ma non locali, usati per il reset locale
  originalIndexDiffs: Record<string, string> = {};

  constructor(private plotService: PlotService,
    private scenarioService: ScenarioService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.loadWidgets();

    this.loadData();
  }
  openSaveModal(): void {
    this.saveModal.toggle();
  }
  formInvalid = false;

  confirmSave(): void {
    if (!this.titolo?.trim() || !this.descrizione?.trim()) {
      this.formInvalid = true;
      return;
    } this.formInvalid = false;
    this.saveAsNewScenario();
  }
  saveAsNewScenario(): void {
    this.scenarioService.saveNewScenario(this.scenarioId, this.problemId, this.changedWidgets, this.titolo, this.descrizione).subscribe({
      next: (res) => {
        // this.notificationService.showError('Scenario salvato con successo!');
        this.hasChanges = false;
        this.closeModal();
        this.router.navigate(['/problems', this.problemId, 'scenari']);


      },
      error: (err) => {
        this.notificationService.showError('Errore durante il salvataggio del nuovo scenario.');
        console.error('Errore salvataggio:', err);
        this.closeModal();

      }
    });
  }
  getIndexNameFromKey(key: string): string {
    for (const group of Object.keys(this.widgets)) {
      const widget = this.widgets[group].find(w => w.index_id === key);
      if (widget) return widget.index_name;
    }
    return key; // fallback se non trovato
  }
  closeModal() {
    this.saveModal.toggle();
  }
  loadWidgets() {
    this.scenarioService.getWidgets().subscribe({
      next: (data) => {
        const initialized = this.initializeWidgetBounds(data);
        this.originalWidgets = JSON.parse(JSON.stringify(initialized)); // copia profonda per reset
        this.widgets = initialized;
      },
      error: (err) => {
        console.error('Errore caricamento widget', err);
        this.notificationService.showError('Errore nel caricamento dei widget.');
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
  onWidgetsChanged(updatedWidgets: Record<string, Widget[]>) {
    console.log('Widgets changed:', updatedWidgets);

    const changedValues: Record<string, number | [number, number]> = {};

    for (const key of Object.keys(updatedWidgets)) {
      const currentGroup = this.originalWidgets[key] || [];
            // const currentGroup = this.widgets[key] || [];

      const updatedGroup = updatedWidgets[key];

      for (let i = 0; i < updatedGroup.length; i++) {
        const updated = updatedGroup[i];
        const original = currentGroup[i];

        if (!original) {
          // Nuovo widget (unlikely ma per sicurezza)
          changedValues[updated.index_id] = this.extractValue(updated);
          continue;
        }

        if (
          updated.v !== original.v ||
          updated.vMin !== original.vMin ||
          updated.vMax !== original.vMax
        ) {
          changedValues[updated.index_id] = this.extractValue(updated);
        }
      }
    }
    //TODO fix always true
    if (true || Object.keys(changedValues).length > 0) {
      console.log('Sending changed widgets:', changedValues);
      this.hasChanges = true;
      this.changedWidgets = changedValues;
      this.updateData(changedValues);
    } else {
      this.hasChanges = false;
      console.log('Widgets are equal, no update needed');
    }
  }

  extractValue(widget: Widget): number | [number, number] {
    if (widget.scale && widget.index_category !== '%') {
      const vMin = widget.vMin ?? widget.loc;
      const vMax = widget.vMax ?? (widget.loc + widget.scale);
      return [vMin ?? 1, vMax ?? 1];
    }
    return widget.v ?? widget.loc ?? 0;
  }
  updateData(values: Record<string, number | [number, number]>) {
    this.loading = true;
    this.scenarioService.getUpdatedPlotInput(this.scenarioId, this.problemId, values).subscribe({
      next: (newInput) => {
        this.inputData = this.plotService.preparePlotInput(newInput.data);
        this.indexDiffs = newInput.index_diffs || {};
        this.kpisData = this.inputData.kpis;
        this.renderPlot();
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore aggiornamento dati:', err);
        this.notificationService.showError('Errore durante l\'aggiornamento del grafico.');
        this.loading = false;
      }
    });
  }
  
  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }
  toggleControls(): void {
    this.showControls = !this.showControls;
  }
  goToCompare(): void {
    // const [s1, s2] = this.selectedScenari;
    this.router.navigate([
      '/problems',
      this.problemId,
      'scenari',
      'confronta',
      this.scenarioId,
      'default'
    ]);
    console.log('Vai alla pagina di confronto');
  }
  private applyIndexDiffsToWidgets(
    widgets: Record<string, Widget[]>,
    indexDiffs: Record<string, string>
  ): Record<string, Widget[]> {
    const clone = JSON.parse(JSON.stringify(widgets));
    for (const key of Object.keys(clone)) {
      for (const widget of clone[key]) {
        const diff = indexDiffs[widget.index_id];
        if (diff) {
          // Esempi di diff: "1.05 -> 1.75" oppure "350-450 -> 350-630"
          const [, newValue] = diff.split('->').map(s => s.trim());
          if (newValue.includes('-')) {
            // Caso range: "350-450 -> 350-630"
            const [minStr, maxStr] = newValue.split('-').map(s => s.replace(/[^\d.]/g, '').trim());
            const min = Number(minStr);
            const max = Number(maxStr);
            if (!isNaN(min)) widget.vMin = min;
            if (!isNaN(max)) widget.vMax = max;
          } else {
            // Caso singolo valore: "1.05 -> 1.75"
            const num = Number(newValue.replace(/[^\d.]/g, ''));
            if (!isNaN(num)) widget.v = num;
          }
        }
      }
    }
    return clone;
  }
  async loadData() {
    this.loading = true;
    if (!this.scenarioId || !this.problemId) {
      this.notificationService.showError('Scenario o problem mancanti.');
      this.loading = false;
      return;
    }
    try {
      const rawData = await firstValueFrom(this.scenarioService.getScenarioData(this.scenarioId, this.problemId));
      this.originalIndexDiffs = { ...(rawData.index_diffs || {}) }; 
      // occhio che qui resetti widget e non hai piu' o valori inizialli
      this.widgets = this.applyIndexDiffsToWidgets(this.initializeWidgetBounds(rawData.widgets), rawData.index_diffs || {});
      this.inputData = this.plotService.preparePlotInput(rawData.data);
      this.editableIndexes = rawData.editable_indexes || [];
      this.indexDiffs = rawData.index_diffs || {};
      this.kpisData = this.inputData.kpis;
      this.setupSelectOptions();


      this.renderPlot();
    } catch (error) {
      console.error('Errore nel caricamento dati scenario', error);
      this.notificationService.showError(
        'Errore nel caricamento dei dati dello scenario. Riprova più tardi.'
      );
    }

    this.loading = false;
  }
  private setupSelectOptions() {
    if (this.inputData?.heatmapsByFunction) {
      this.selectOptions = [
        { value: 'default', text: 'Default' },
        ...Object.keys(this.inputData.heatmapsByFunction).map(key => ({
          value: key,
          text: key
        }))
      ];
    }
  }
  onFunzioneChange() {
    this.renderPlot();
  }
  resetIndexDiffs(): void {
    this.widgets = this.applyIndexDiffsToWidgets(this.widgets, this.originalIndexDiffs);
    this.indexDiffs = Object.fromEntries(
      Object.entries(this.originalIndexDiffs).map(([key, value]) => [key, Number(value)])
    );
        this.changedWidgets = {};
    this.hasChanges = false;
    this.notificationService.showError('Modifiche ripristinate.');
    this.updateData({});

  }
  renderPlot() {
    if (!this.chartLib || !this.inputData) return;
    if (this.monoDimensionale) {
      this.plotService.renderMonoDimensionale(this.sottosistemaSelezionato, this.chartLib.nativeElement, this.inputData);
      return;
    }
    const input = JSON.parse(JSON.stringify(this.inputData)) as PlotInput;
    this.plotService.renderBidimensionale(
      this.sottosistemaSelezionato,
      this.chartLib.nativeElement, this.inputData
    );


  }



}
