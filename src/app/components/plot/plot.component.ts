// plot.component.ts
import { Component, ElementRef, AfterViewInit, ViewChild, Input } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { PlotService } from '../../services/plot.service';
import { Curve, KPIs, PlotInput } from '../../models/plot.model';
import {
  SUBSYSTEM_OPTIONS,
  PLOT_COLORS,
  HEATMAP_COLOR_SCALE,
  DEFAULT_LAYOUT
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
  widgets: Record<string, Widget[]> = {};
  sottosistemi = SUBSYSTEM_OPTIONS;
  editableIndexes : string[] = [];
  objectKeys = Object.keys;

  // editSidebarVisible = false;
  selectedScenario: any = null;
  isEditing: boolean = false;
  showControls: boolean = false; // per 'settings'
  hasChanges: boolean=false;
  changedWidgets!: Record<string, number | [number, number]>;
  indexDiffs: Record<string, number> = {};
  titolo: string = '';
  descrizione: string = '';

  constructor(private plotService: PlotService,
     private scenarioService: ScenarioService,
      private notificationService: NotificationService,
      private router: Router
  ) { }

  ngAfterViewInit() {
    this.loadData();
    this.loadWidgets();
  }
  openSaveModal(): void {
    this.saveModal.toggle();
  }
  formInvalid = false;

  confirmSave(): void {
    if (!this.titolo?.trim() || !this.descrizione?.trim()) {
      this.formInvalid = true;
      return;
    }     this.formInvalid = false;
    this.saveAsNewScenario();
  }
  saveAsNewScenario(): void {
    this.scenarioService.saveNewScenario(this.scenarioId, this.problemId,this.changedWidgets,this.titolo,this.descrizione).subscribe({
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
      const currentGroup = this.widgets[key] || [];
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
  
    if (Object.keys(changedValues).length > 0) {
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
    return widget.scale && widget.index_category !== '%'
      ? [widget.vMin ?? 0, widget.vMax ?? 0]
      : widget.v ?? 0;
  }
  updateData(values: Record<string, number | [number, number]>) {
    this.scenarioService.getUpdatedPlotInput(this.scenarioId, this.problemId, values).subscribe({
      next: (newInput) => {
        this.inputData = this.plotService.preparePlotInput(newInput.data);
        this.indexDiffs = newInput.index_diffs || {};
        this.kpisData = this.inputData.kpis;

        this.renderPlot();
      },
      error: (err) => {
        console.error('Errore aggiornamento dati:', err);
        this.notificationService.showError('Errore durante l\'aggiornamento del grafico.');
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
  async loadData() {
    this.loading = true;
    if (!this.scenarioId || !this.problemId) {
      this.notificationService.showError('Scenario o problem mancanti.');
      this.loading = false;
      return;
    }
    try {
      // const rawData = await this.scenarioService.fetchScenarioData();
      //todo
      const rawData = await firstValueFrom(this.scenarioService.getScenarioData(this.scenarioId, this.problemId));

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
  onHeatmapToggle() {
    this.renderPlot(); // Ricalcola il grafico quando lo switch cambia
  }
  async renderMonoDimensionale(input: PlotInput | null) {
    if (!this.chartLib || !input?.kpis) return;
  
    let uncertaintyData: any[] = [];
    if (this.sottosistemaSelezionato === 'default') {
       uncertaintyData = Array.isArray(input.kpis?.['uncertainty']) ? input.kpis['uncertainty'] : [];   
       } else {
      uncertaintyData = (input.kpis?.['uncertainty_by_constraint'] as Record<string, any>)?.[this.sottosistemaSelezionato] ?? [];
    }
    if (!uncertaintyData.length) return;
  
    // Ordina per usage crescente
    const sorted = [...uncertaintyData].sort((a, b) => a.usage - b.usage);
  
    const x = sorted.map((_, i) => i);                      // 0,1,2,...
    const y = sorted.map(d => d.usage);                     // valore da plottare verticalmente
    const colorValues = sorted.map(d => d.usage_uncertainty); // per colori
  
    const usageMax = Math.max(...y);
    const yAxisMax = usageMax * 1.2;
  
    const trace: Partial<Plotly.PlotData> = {
      x,
      y,
      type: 'scatter',
      mode: 'markers',
      name: 'Presenze',
      marker: {
        color: colorValues,
        colorscale: [
          [0.0, 'rgb(5, 102, 8)'],
          [0.05, 'rgb(100, 180, 90)'],
          [0.20, 'rgb(180, 230, 170)'],
          [0.40, 'rgb(230, 250, 225)'],
          [0.50, 'yellow'],
          [0.60, 'rgb(255, 242, 242)'],
          [0.80, 'rgb(242, 204, 204)'],
          [0.95, 'rgb(204, 76, 76)'],
          [1.0, 'rgb(180, 4, 38)']
        ],
        cmin: 0,
        cmax: 1,
        size: 8,

      },
      hovertemplate: 'Giorno: %{x}<br>Usage: %{y}%<br>Incertezza: %{marker.color:.4f}<extra></extra>'
    };
  
    const layout: Partial<Plotly.Layout> = {
      ...DEFAULT_LAYOUT,
      xaxis: {
        title: { text: 'Giorni (ordinati per usage)' },
        tickformat: '.0f'
      },
      yaxis: {
        title: { text: 'Livello di utilizzo della destinazione' },
        range: [0, yAxisMax],
        tickformat: '.0f'
      },
      margin: { t: 50, b: 80, l: 80, r: 60 },
      showlegend: true,
      legend: {
        orientation: 'h',
        yanchor: 'top',
        y: -0.2,
        xanchor: 'center',
        x: 0.5
      },
    };
    
    const capacityMean = this.sottosistemaSelezionato === 'default' ?
    input.capacity_mean :
    input.capacity_mean_by_constraint?.[this.sottosistemaSelezionato];
    const traceCapacityMean: Partial<Plotly.PlotData> = {
      x,
      y: Array(x.length).fill(capacityMean),
      type: 'scatter',
      mode: 'lines',
      name: this.getCapacityLabel(this.sottosistemaSelezionato),
      line: { color: PLOT_COLORS.capacityMean, dash: 'dash', width: 2 },
      yaxis: 'y1',
      showlegend: true,

    };
    const traces: Partial<Plotly.PlotData>[] = [
      traceCapacityMean
    ];

      traces.push(trace);
    const plot = await Plotly.newPlot(this.chartLib.nativeElement, traces, layout, { responsive: true });
    plot.on('plotly_legendclick', () => false);
    plot.on('plotly_legenddoubleclick', () => false);
  }
  
  
  
  getCapacityLabel(subsystem: string): string {
    return subsystem === 'default' ? 'Soglia di sovraffollamento' : 'Capacità di carico';
  }

  renderPlot() {
    if (!this.chartLib || !this.inputData) return;
    if (this.monoDimensionale) {
      this.renderMonoDimensionale(this.inputData);
      return;
    }
    const input = JSON.parse(JSON.stringify(this.inputData)) as PlotInput;
  
    // Scegli la sorgente dei punti in base al sottosistema selezionato
    let uncertaintyData: any[] = [];
    if (this.sottosistemaSelezionato === 'default') {
       uncertaintyData = Array.isArray(input.kpis?.['uncertainty']) ? input.kpis['uncertainty'] : [];   
       } else {
      uncertaintyData = (input.kpis?.['uncertainty_by_constraint'] as Record<string, any>)?.[this.sottosistemaSelezionato] ?? [];
    }
  
    // Ricostruisci i punti per il grafico
    input.points = [{
      name: 'Presenze',
      x: uncertaintyData.map((p: any) => p.tourists),
      y: uncertaintyData.map((p: any) => p.excursionists),
      customdata: uncertaintyData.map((p: any) => p.index),
      marker: {
        color: uncertaintyData.map((p: any) => p.index),
        colorscale: [
          [0.0, 'rgb(5, 102, 8)'],
          [0.05, 'rgb(100, 180, 90)'],
          [0.20, 'rgb(180, 230, 170)'],
          [0.40, 'rgb(230, 250, 225)'],
          [0.50, 'yellow'],
          [0.60, 'rgb(255, 242, 242)'],
          [0.80, 'rgb(242, 204, 204)'],
          [0.95, 'rgb(204, 76, 76)'],
          [1.0, 'rgb(180, 4, 38)']
        ],
        showscale: false,
        reversescale: true,
        cmin: 0,
        cmax: 1,
        size: 7,
        // line: {
        //   color: 'black',
        //   width: 0
        // },
        colorbar: {
          title: 'Indice incertezza',
          titleside: 'right'
        }
      },
      mode: 'markers',
      type: 'scatter',
      hovertemplate:
        '<b>Contesto:</b> %{customdata}<br>' +
        '<b>Turisti:</b> %{x}<br>' +
        '<b>Escursionisti:</b> %{y}<br>' +
        '<extra></extra>',
      showlegend: false
    }];
  
    this.renderFunctionPlot(this.chartLib.nativeElement, input);
  }

  getYFromCurve(curve: Curve, xVal: number): number | null {
    const idx = curve.x.findIndex((xi, i) => i < curve.x.length - 1 && curve.x[i] <= xVal && xVal <= curve.x[i + 1]);
    if (idx === -1) return null;
    const x0 = curve.x[idx], x1 = curve.x[idx + 1];
    const y0 = curve.y[idx], y1 = curve.y[idx + 1];
    const t = (xVal - x0) / (x1 - x0);
    return y0 + t * (y1 - y0);
  }

  async renderFunctionPlot(container: HTMLElement, input: PlotInput) {

    const data: Partial<Plotly.PlotData>[] = [];
    const curvesToRender = this.sottosistemaSelezionato === 'default'
      ? input.curves
      : input.curves.filter(c => c.name === this.sottosistemaSelezionato);


    for (const curve of curvesToRender) {
      data.push({
        x: curve.x,
        y: curve.y,
        mode: 'lines',
        name: curve.name,
        line: {
          color: curve.color ?? 'black',
          dash: curve.dash ?? 'solid',
          width: 3,
        },
        hoverinfo: 'name',
        type: 'scatter',
      });
    }

    if (input.points?.length) {
      for (const pt of input.points) {
        // if (!this.showAllSubsystems && pt.name !== this.sottosistemaSelezionato) continue;

        data.push({
          x: pt.x,
          y: pt.y,
          type: 'scatter',
          mode: 'markers',
          name: pt.name,
          marker: pt.marker ?? {
            color: pt.color ?? 'black',
            size: 8,
            line: { width: 1, color: 'black' },
          },
          hoverinfo: 'x+y+name',
        });
      }
    }
    const layout: Partial<Plotly.Layout> = {
      plot_bgcolor: 'white',
      // title: { text: 'Scenario con Heatmap' },
      margin: { t: 50, b: 130, l: 80, r: 20 },
      xaxis: {
        title: { text: 'TURISTI' },
        range: [0, 10000],
        tickformat: '.0f',
        showline: true,
        linewidth: 1,
        linecolor: 'grey',
        dtick: 1000
      },
      yaxis: {
        title: { text: 'ESCURSIONISTI' },
        range: [0, 10000],
        tickformat: '.0f',
        showline: true,
        linewidth: 1,
        linecolor: 'grey',
        dtick: 1000
      },
      shapes: [
        {
          type: 'line',
          x0: 0, y0: 10000,
          x1: 10000, y1: 10000,
          xref: 'x', yref: 'y',
          line: { color: 'grey', width: 2 }
        },
        {
          type: 'line',
          x0: 10000, y0: 0,
          x1: 10000, y1: 10000,
          xref: 'x', yref: 'y',
          line: { color: 'grey', width: 2 }
        }
      ],
      showlegend: true,
      legend: {
        orientation: 'h',
        yanchor: 'top',
        y: -0.2,
        xanchor: 'center',
        x: 0.5,
            },
    };

    const plot= await Plotly.newPlot(container, data, layout, { responsive: true });
    plot.on('plotly_legendclick', () => false);
    plot.on('plotly_legenddoubleclick', () => false);

  
  }
}
