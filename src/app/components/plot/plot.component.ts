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

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  standalone: false,
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements AfterViewInit {
  @ViewChild('chartLib', { static: false }) chartLib!: ElementRef<HTMLElement>;
  @Input() editing: boolean = false;
  @Input() scenarioId!: string;
  @Input() problemId!: string;


  inputData: PlotInput | null = null;
  sottosistemaSelezionato = 'default';
  loading = true;
  selectOptions: Array<{ value: string; text: string }> = [{ value: 'default', text: 'Default' }];
  heatmapAttiva = true;
  showAllSubsystems = true;
  mostraPunti = true;
  monoDimensionale = false;
  kpisData: KPIs | undefined;
  noteUtente: string = '';
  widgets: Record<string, Widget[]> = {};
  sottosistemi = SUBSYSTEM_OPTIONS;
  objectKeys = Object.keys;

  // editSidebarVisible = false;
  selectedScenario: any = null;
  isEditing: boolean = false;
  showControls: boolean = false; // per 'settings'

  // openEdit() {
  //   this.editSidebarVisible = true;
  // }

  // onScenarioSave(edited: any) {
  //   // Aggiorna la lista/scenario con i nuovi dati
  //   this.editSidebarVisible = false;
  // }
  constructor(private plotService: PlotService,
     private scenarioService: ScenarioService,
      private notificationService: NotificationService,
      private router: Router
  ) { }

  ngAfterViewInit() {
    this.loadData();
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
      this.updateData(changedValues);
    } else {
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
        this.renderPlot();
      },
      error: (err) => {
        console.error('Errore aggiornamento dati:', err);
        this.notificationService.showError('Errore durante l\'aggiornamento del grafico.');
      }
    });
  }
  formatNumber(value: number): string {
    return value.toFixed(2);
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
  renderMonoDimensionale(input: PlotInput | null) {
    if (!this.chartLib || !input || !input.usage || !input.sample_t || !input.sample_e) return;

    const usage = this.sottosistemaSelezionato === 'default' ?
      input.usage :
      input.usage_by_constraint?.[this.sottosistemaSelezionato];

    const capacityMean = this.sottosistemaSelezionato === 'default' ?
      input.capacity_mean :
      input.capacity_mean_by_constraint?.[this.sottosistemaSelezionato];
    const capacity = this.sottosistemaSelezionato === 'default' ?
      input.capacity :
      input.capacity_by_constraint?.[this.sottosistemaSelezionato];

    if (!usage || !capacity) return;
    const sampleT = input.sample_t;
    const sampleE = input.sample_e;
    // const capacityMean = capacity ?? 0;
    // Ordina per usage crescente
    const sortedIndices = usage
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => a.val - b.val)
      .map(obj => obj.idx);

    //ottengo gli indici da 0 a n-1
    const x = sortedIndices.map((_, i) => i);

    // Flatten della capacity: da number[][] → number[]
    const capacityFlat = Array.isArray(capacity) ? capacity.map(row => Array.isArray(row) ? row[0] : 0) : [];

    const traceSampleT: Partial<Plotly.PlotData> = {
      x,
      y: sortedIndices.map(i => sampleT[i] * 1.2),
      name: 'Turisti',
      marker: { color: PLOT_COLORS.sampleT },
      type: 'bar',
      yaxis: 'y2',
    };

    const traceSampleE: Partial<Plotly.PlotData> = {
      x,
      y: sortedIndices.map(i => sampleE[i] * 1.2),
      name: 'Escursionisti',
      type: 'bar',
      marker: { color: PLOT_COLORS.sampleE },

      yaxis: 'y2',
    };

    const traceCapacityMean: Partial<Plotly.PlotData> = {
      x,
      y: Array(x.length).fill(capacityMean),
      type: 'scatter',
      mode: 'lines',
      name: 'Capacity Mean',
      line: { color: PLOT_COLORS.capacityMean, dash: 'dash', width: 2 },
      yaxis: 'y1',
    };
    const threshold = this.sottosistemaSelezionato === 'default'
      ? input.capacity_mean
      : input.capacity_mean_by_constraint?.[this.sottosistemaSelezionato];


    const updatedColor = sortedIndices.map(i =>
      usage[i] > (threshold ?? 0) ? PLOT_COLORS.overThreshold : PLOT_COLORS.underThreshold
    );

    const traceUsagePoints: Partial<Plotly.PlotData> = {
      x,
      y: sortedIndices.map(i => usage[i]),
      type: 'scatter',
      mode: 'markers',
      name: 'Usage',
      marker: {
        color: updatedColor,
        size: 6,
        line: { width: 1, color: 'white' }
      },
      yaxis: 'y1'
    };

    const heatmap = this.heatmapAttiva && capacityFlat.length
      ? [<Partial<Plotly.PlotData>>{
        z: capacityFlat.map(val => Array(x.length).fill(val)),
        x,
        y: capacityFlat.map((_, i) => i),
        type: 'heatmap',
        zmin: 0,
        zmax: 1,
        colorscale: HEATMAP_COLOR_SCALE,

        // showscale: true,
        hovertemplate: 'x: %{x}<br>y: %{y}<br>z: %{z}<extra></extra>',
        colorbar: {
          x: -0.15,
          thickness: 15,
          len: 0.8
        }
      }]
      : [];
    const usageMax = Math.max(...sortedIndices.map(i => usage[i]));
    const yAxisMax = usageMax * 1.2;
    const layout: Partial<Plotly.Layout> = {
      ...DEFAULT_LAYOUT,
      title: { text: 'Modalità Monodimensionale: Presenze vs Capacità' },
      barmode: 'stack',
      xaxis: { title: { text: 'Indice ordinato per usage' } },

      yaxis: {
        title: { text: 'Overturismo (capacity)' },
        side: 'left',
        overlaying: undefined,
        range: [0, yAxisMax]

      },

      yaxis2: {
        title: { text: 'Presenze (turisti + escursionisti)' },
        side: 'right',
        overlaying: 'y',
      }
    };

    const traces: Partial<Plotly.PlotData>[] = [
      ...heatmap,
      traceSampleE,
      traceSampleT,
      traceCapacityMean
    ];

    if (this.mostraPunti) {
      traces.push(traceUsagePoints);
    }

    Plotly.newPlot(this.chartLib.nativeElement, traces, layout, { responsive: true });
  }


  renderPlot() {
    if (!this.chartLib || !this.inputData) return;
    if (this.monoDimensionale) {
      this.renderMonoDimensionale(this.inputData);
      return;
    }
    // Clona l'input per manipolarlo senza effetti collaterali
    const input = JSON.parse(JSON.stringify(this.inputData)) as PlotInput;

    if (this.sottosistemaSelezionato !== 'default' && input.heatmapsByFunction) {
      const specific = input.heatmapsByFunction[this.sottosistemaSelezionato];
      if (specific) {
        input.heatmap = {
          x: input.heatmap?.x || [],
          y: input.heatmap?.y || [],
          z: specific,
        };
      }
    }

    if (this.mostraPunti && input.points?.length) {
      input.points = input.points.map(pt => {
        const updatedColor = pt.y.map((_y, i) => {
          const xVal = pt.x[i];
          let violates = false;

          const curvesToCheck = this.showAllSubsystems
            ? input.curves
            : input.curves.filter(c => c.name === this.sottosistemaSelezionato);

          for (const c of curvesToCheck) {
            const yExpected = this.getYFromCurve(c, xVal);
            if (yExpected !== null && pt.y[i] > yExpected) {
              violates = true;
              break;
            }
          }

          return violates ? '#BA0C2F' : '#32CD32';
        });

        return { ...pt, color: updatedColor };
      });
    } else {
      input.points = [];
    }

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

  renderFunctionPlot(container: HTMLElement, input: PlotInput) {

    const data: Partial<Plotly.PlotData>[] = [];

    if (this.heatmapAttiva && input.heatmap) {
      data.push({
        z: input.heatmap.z,
        x: input.heatmap.x,
        y: input.heatmap.y,
        type: 'heatmap',
        colorscale: [
          [0, 'rgb(150, 0, 24)'],
          [0.5, 'rgb(255,255,255)'],
          [1, 'rgb(0,0,255)']
        ],
        zmin: 0,
        zmax: 1,
        showscale: true,
        hovertemplate: 'x: %{x}<br>y: %{y}<br>z: %{z}<extra></extra>'
      });
    }

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
          marker: {
            color: pt.color ?? 'black',
            size: 8,
            line: { width: 1, color: 'black' },
          },
          hoverinfo: 'x+y+name',
        });
      }
    }

    const layout: Partial<Plotly.Layout> = {
      title: { text: 'Scenario con Heatmap' },
      xaxis: { title: { text: 'Turisti' }, range: [0, input.xMax ?? undefined] },
      yaxis: { title: { text: 'Escursionisti' }, range: [0, input.yMax ?? undefined] },
      margin: { l: 60, r: 30, t: 40, b: 50 },
      showlegend: true,
      legend: {
        orientation: 'h',
        x: 0,
        y: -0.2,
        xanchor: 'left',
        yanchor: 'top',
      }
    };

    Plotly.newPlot(container, data, layout, { responsive: true });
  }
}
