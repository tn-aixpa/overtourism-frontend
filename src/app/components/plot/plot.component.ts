// plot.component.ts
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import { PlotService } from '../../services/plot.service';
import { Curve, KPIs, PlotInput } from '../../models/plot.model';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  standalone: false,
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements AfterViewInit {
  @ViewChild('chartLib', { static: false }) chartLib!: ElementRef<HTMLElement>;

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
  // sottosistemaSelezionato = 'Parcheggi';
  sottosistemi = [
    { value: 'parcheggi', label: 'Parcheggi' },
    { value: 'spiaggia', label: 'Spiaggia' },
    { value: 'alberghi', label: 'Alberghi' },
    { value: 'ristoranti', label: 'Ristoranti' }
  ];
  constructor(private plotService: PlotService) { }

  ngAfterViewInit() {
    this.loadData();
  }
  formatNumber(value: number): string {
    return value.toFixed(2);
  }
  async loadData() {
    this.loading = true;
    this.inputData = await this.plotService.fetchPlotData();
    this.kpisData = this.inputData.kpis;
    this.loading = false;

    if (this.inputData?.heatmapsByFunction) {
      this.selectOptions = [
        { value: 'default', text: 'Default' },
        ...Object.keys(this.inputData.heatmapsByFunction).map(key => ({ value: key, text: key }))
      ];
    }

    this.renderPlot();
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
      y: sortedIndices.map(i => sampleT[i]),
      name: 'Turisti',
      marker: { color: 'rgba(211, 211, 211, 0.7)' }, // Light gray color
      type: 'bar',
      yaxis: 'y2',
    };

    const traceSampleE: Partial<Plotly.PlotData> = {
      x,
      y: sortedIndices.map(i => sampleE[i]),
      name: 'Escursionisti',
      type: 'bar',
      marker: { color: 'rgba(64, 64, 64, 0.7)' },// Dark gray color

      yaxis: 'y2',
    };

    const traceCapacityMean: Partial<Plotly.PlotData> = {
      x,
      y: Array(x.length).fill(capacityMean),
      type: 'scatter',
      mode: 'lines',
      name: 'Capacity Mean',
      line: { color: 'red', dash: 'dash', width: 2 },
      yaxis: 'y1',
    };
    const threshold = this.sottosistemaSelezionato === 'default'
    ? input.capacity_mean
    : input.capacity_mean_by_constraint?.[this.sottosistemaSelezionato];
  
  const updatedColor = sortedIndices.map(i =>
    usage[i] > (threshold ?? 0) ? '#BA0C2F' : '#32CD32'
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
        colorscale: [
          [0, 'rgb(0,0,255)'],
          [0.5, 'rgb(255,255,255)'],
          [1, 'rgb(150, 0, 24)']
        ],
        // showscale: true,
        hovertemplate: 'x: %{x}<br>y: %{y}<br>z: %{z}<extra></extra>',
        colorbar: {
          x: -0.15, 
          thickness: 15,
          len: 0.8
        }
      }]
      : [];

    const layout: Partial<Plotly.Layout> = {
      title: { text: 'Modalità Monodimensionale: Presenze vs Capacità' },
      barmode: 'stack',
      xaxis: { title: { text: 'Indice ordinato per usage' } },

      yaxis: {
        title: { text: 'Overturismo (capacity)' },
        side: 'left',
        overlaying: undefined,
      },

      yaxis2: {
        title: { text: 'Presenze (turisti + escursionisti)' },
        side: 'right',
        overlaying: 'y',
      },

      height: 500,
      width: 800,
      showlegend: true,
      legend: {
        orientation: 'h',
        x: 0,
        y: -0.2,
        xanchor: 'left',
        yanchor: 'top',
      },
      margin: { l: 60, r: 60, t: 40, b: 50 },
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
          [0, 'rgb(0,0,255)'],
          [0.5, 'rgb(255,255,255)'],
          [1, 'rgb(150, 0, 24)']
        ],
        zmin: 0,
        zmax: 1,
        showscale: true,
        hovertemplate: 'x: %{x}<br>y: %{y}<br>z: %{z}<extra></extra>'
      });
    }

    const curvesToRender = this.showAllSubsystems
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
      },
      height: 500,
      width: 800,
    };

    Plotly.newPlot(container, data, layout, { responsive: true });
  }
}
