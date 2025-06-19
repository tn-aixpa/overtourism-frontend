import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Plotly from 'plotly.js-dist-min';
import { KPIs, PlotInput, Curve } from '../../../models/plot.model';
import { PlotService } from '../../../services/plot.service';
import { ScenarioService } from '../../../services/scenario.service';
import { SUBSYSTEM_OPTIONS,  PLOT_COLORS,
  HEATMAP_COLOR_SCALE,
  DEFAULT_LAYOUT } from '../../../components/plot/plot.config';

@Component({
  selector: 'app-confronto-scenari',
  templateUrl: './confronto-scenari.component.html',
  styleUrls: ['./confronto-scenari.component.scss'],
  standalone: false
})
export class ConfrontoScenariComponent {
  scenari: any[] = [];
  selectedScenario1Id!: string;
  selectedScenario2Id!: string;
  problemId!: string;
  selectedControlOption!: string;

  kpisLeft?: KPIs;
  kpisRight?: KPIs;
  // heatmapAttiva = true;
  // mostraPunti = true;
  monoDimensionale = false;
  showAllSubsystems = true;
  sottosistemi = SUBSYSTEM_OPTIONS;
  sottosistemaSelezionato = 'default';

  @ViewChild('chartLeft', { static: true }) chartLeft!: ElementRef<HTMLElement>;
  @ViewChild('chartRight', { static: true }) chartRight!: ElementRef<HTMLElement>;
  showControls: boolean = false; // per 'settings'

  constructor(
    private scenarioService: ScenarioService,
    private plotService: PlotService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.problemId = this.route.snapshot.paramMap.get('problemId')!;


    this.scenarioService.getScenariosByProblemId(this.problemId).subscribe(scenari => {
      this.scenari = scenari;
      if (scenari.length >= 2) {
        this.selectedScenario1Id = this.route.snapshot.paramMap.get('id1')!;
        this.selectedScenario2Id = this.route.snapshot.paramMap.get('id2') ?? scenari[1].id ?? '';
        this.loadScenario(1);
        this.loadScenario(2);
      }
    });
  }
  getScenarioName(id: string | undefined): string | undefined {
    return this.scenari.find(s => s.id === id)?.name;
  }
  
  selectScenario(slot: 1 | 2, id: string): void {
    if (slot === 1) {
      this.selectedScenario1Id = id;
      this.loadScenario(1);
    } else {
      this.selectedScenario2Id = id;
      this.loadScenario(2);
    }
  }
  
  onPlotControlChange(value: string) {
    this.selectedControlOption = value;
    this.renderBoth()
  }

  onShowAllSubsystemsChange(value: boolean) {
    this.showAllSubsystems = value;
    this.renderBoth();
  }

  // onMostraPuntiChange(value: boolean) {
  //   this.mostraPunti = value;
  //   this.renderBoth();
  // }

  onMonoDimensionaleChange(value: boolean) {
    this.monoDimensionale = value;
    this.renderBoth();
  }

  // onHeatmapAttivaChange(value: boolean) {
  //   this.heatmapAttiva = value;
  //   this.renderBoth();
  // }

  onSottosistemaSelezionatoChange(value: string) {
    this.sottosistemaSelezionato = value;
    this.renderBoth();
  }

  onFunzioneChange() {
    this.renderBoth();
  }

  // onHeatmapToggle() {
  //   this.renderBoth();
  // }
  toggleControls(): void {
    this.showControls = !this.showControls;
  }
  renderBoth() {
    this.loadScenario(1);
    this.loadScenario(2);
  }

  async loadScenario(slot: 1 | 2) {
    const id = slot === 1 ? this.selectedScenario1Id : this.selectedScenario2Id;
    if (!id) return;

    const res = await this.scenarioService.getScenarioData(id, this.problemId).toPromise();
    const input = this.plotService.preparePlotInput(res.data);

    const container = slot === 1 ? this.chartLeft.nativeElement : this.chartRight.nativeElement;
    if (slot === 1) this.kpisLeft = input.kpis;
    else this.kpisRight = input.kpis;

    this.renderChart(container, input);
  }

  renderChart(container: HTMLElement, input: PlotInput) {
    const cloned = JSON.parse(JSON.stringify(input)) as PlotInput;
  
    // === MONODIMENSIONALE ===
    if (this.monoDimensionale) {
      this.renderMonoDimensionale(container, cloned);
      return;
    }
  
    // // === Heatmap custom ===
    // if (this.sottosistemaSelezionato !== 'default' && cloned.heatmapsByFunction) {
    //   const specific = cloned.heatmapsByFunction[this.sottosistemaSelezionato];
    //   if (specific) {
    //     cloned.heatmap = {
    //       x: cloned.heatmap?.x || [],
    //       y: cloned.heatmap?.y || [],
    //       z: specific,
    //     };
    //   }
    // }
    // if (!cloned.points || !cloned.points.length) {
      let uncertaintyData: any[] = [];
      if (this.sottosistemaSelezionato === 'default') {
        uncertaintyData = Array.isArray(cloned.kpis?.['uncertainty']) ? cloned.kpis['uncertainty'] : [];
      } else {
        uncertaintyData = (cloned.kpis?.['uncertainty_by_constraint'] as Record<string, any>)?.[this.sottosistemaSelezionato] ?? [];
      }
    
      cloned.points = [{
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
          reversescale: true,
          cmin: 0,
          cmax: 1,
          size: 7,
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
    // }
    // === Punti colorati ===
    if (cloned.points?.length) {
      cloned.points = cloned.points.map(pt => {
        const updatedColor = pt.y.map((_y, i) => {
          const xVal = pt.x[i];
          let violates = false;
  
          const curvesToCheck = this.showAllSubsystems
            ? cloned.curves
            : cloned.curves.filter(c => c.name === this.sottosistemaSelezionato);
  
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
      cloned.points = [];
    }
  
    const data: Partial<Plotly.PlotData>[] = [];
  
    // // === Heatmap ===
    // if (this.heatmapAttiva && cloned.heatmap) {
    //   const y = cloned.heatmap.y;
    //   const yRange = y.length > 0 ? [Math.min(...y), Math.max(...y)] : undefined;
  
    //   data.push({
    //     z: cloned.heatmap.z,
    //     x: cloned.heatmap.x,
    //     y: y,
    //     type: 'heatmap',
    //     colorscale: [
    //       [0, 'rgb(150, 0, 24)'],
    //       [0.5, 'rgb(255,255,255)'],
    //       [1, 'rgb(0,0,255)']
    //     ],
    //     zmin: 0,
    //     zmax: 1,
    //     showscale: true,
    //     hovertemplate: 'x: %{x}<br>y: %{y}<br>z: %{z}<extra></extra>'
    //   });
  
    //   // Forziamo il range y se definito
    //   if (yRange) {
    //     data.push({}); // dummy per forzare layout più compatto
    //   }
    // }
  
    // === Curve ===
    const curvesToRender = this.sottosistemaSelezionato === 'default'
      ? cloned.curves
      : cloned.curves.filter(c => c.name === this.sottosistemaSelezionato);
  
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
        type: 'scatter'
      });
    }
  
    // === Punti ===
    if (cloned.points?.length) {
      for (const pt of cloned.points) {
        data.push({
          x: pt.x,
          y: pt.y,
          type: pt.type ?? 'scatter',
          mode: pt.mode ?? 'markers',
          name: pt.name,
          customdata: pt.customdata,
          marker: pt.marker ?? {
            color: pt.color ?? 'black',
            size: 8,
            line: { width: 1, color: 'black' },
          },
          hovertemplate: pt.hovertemplate ?? 'x: %{x}<br>y: %{y}<br><extra></extra>',
          showlegend: pt.showlegend ?? true
        });
      }
    }
  
    const layout: Partial<Plotly.Layout> = {
      margin: { t: 30, l: 50, r: 30, b: 50 },
      yaxis: {
        title: { text: 'Escursionisti' },
        range: [0, input.yMax ?? undefined]
      },
      xaxis: {
        title: { text: 'Turisti' },
        range: [0, input.xMax ?? undefined]
      },
      title: { text: '' },
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
  onScenarioSelect(slot: 1 | 2, selectedId: string) {
    if (slot === 1) {
      this.selectedScenario1Id = selectedId;
    } else {
      this.selectedScenario2Id = selectedId;
    }
    this.loadScenario(slot);
  }
  renderMonoDimensionale(container: HTMLElement, input: PlotInput): void {
    const sampleT = input.sample_t;
    const sampleE = input.sample_e;
  
    if (!sampleT || !sampleE) return;
  
    const usage = this.sottosistemaSelezionato === 'default'
      ? input.usage
      : input.usage_by_constraint?.[this.sottosistemaSelezionato];
  
    const capacityMean = this.sottosistemaSelezionato === 'default'
      ? input.capacity_mean
      : input.capacity_mean_by_constraint?.[this.sottosistemaSelezionato];
  
    const capacity = this.sottosistemaSelezionato === 'default'
      ? input.capacity
      : input.capacity_by_constraint?.[this.sottosistemaSelezionato];
  
    if (!usage || !capacity) return;
  
    const sortedIndices = usage
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => a.val - b.val)
      .map(obj => obj.idx);
  
    const x = sortedIndices.map((_, i) => i);
  
    const capacityFlat = Array.isArray(capacity)
      ? capacity.map(row => Array.isArray(row) ? row[0] : 0)
      : [];
  
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
  
    // const heatmap: Partial<Plotly.PlotData>[] = (this.heatmapAttiva && capacityFlat.length)
    //   ? [{
    //     z: capacityFlat.map(val => Array(x.length).fill(val)),
    //     x,
    //     y: capacityFlat.map((_, i) => i),
    //     type: 'heatmap',
    //     zmin: 0,
    //     zmax: 1,
    //     colorscale: HEATMAP_COLOR_SCALE,
    //     hovertemplate: 'x: %{x}<br>y: %{y}<br>z: %{z}<extra></extra>',
    //     colorbar: {
    //       x: -0.15,
    //       thickness: 15,
    //       len: 0.8
    //     }
    //   }]
    //   : [];
  
    const usageMax = Math.max(...sortedIndices.map(i => usage[i]));
    const yAxisMax = usageMax * 1.2;
  
    const layout: Partial<Plotly.Layout> = {
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
      // ...heatmap,
      traceSampleE,
      traceSampleT,
      traceCapacityMean
    ];
  
    // if (this.mostraPunti) {
      traces.push(traceUsagePoints);
    // }
  
    Plotly.newPlot(container, traces, layout, { responsive: true });
  }
  
  getYFromCurve(curve: Curve, xVal: number): number | null {
    const idx = curve.x.findIndex((xi, i) => i < curve.x.length - 1 && curve.x[i] <= xVal && xVal <= curve.x[i + 1]);
    if (idx === -1) return null;
    const x0 = curve.x[idx], x1 = curve.x[idx + 1];
    const y0 = curve.y[idx], y1 = curve.y[idx + 1];
    const t = (xVal - x0) / (x1 - x0);
    return y0 + t * (y1 - y0);
  }

  formatNumber(value: number): string {
    return value.toFixed(2);
  }
}
