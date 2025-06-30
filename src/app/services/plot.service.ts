import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlotInput, Curve, Point } from '../models/plot.model';
import Plotly from 'plotly.js-dist-min';
import { DEFAULT_LAYOUT, PLOT_COLORS, RISK_COLOR_SCALE } from '../components/plot/plot.config';

@Injectable({ providedIn: 'root' })
export class PlotService {

  constructor() {

  }


  getDashForGroup(groupName: string): 'solid' | 'dot' | 'dash' | 'dashdot' {
    const dashes: Record<string, 'solid' | 'dot' | 'dash' | 'dashdot'> = {
      parcheggi: 'solid',
      spiaggia: 'dot',
      alberghi: 'dash',
      ristoranti: 'dashdot',
    };
    return dashes[groupName] ?? 'solid';
  }
  async renderFunctionPlot(sottosistemaSelezionato: string, container: HTMLElement, input: PlotInput) {

    const data: Partial<Plotly.PlotData>[] = [];
    const curvesToRender = sottosistemaSelezionato === 'default'
      ? input.curves
      : input.curves.filter(c => c.name === sottosistemaSelezionato);


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
      margin: { t: 30, l: 50, r: 30, b: 50 },
      yaxis: {
        title: { text: 'Escursionisti' },
        range: [0, input.yMax ?? undefined],
        scaleanchor: 'x',
        scaleratio: 1,
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

    this.renderPlot(container, data, layout);


  }

  preparePlotInput(module: any): PlotInput {

    // Curves
    const curves: Curve[] = Object.entries(module.constraint_curves ?? {}).map(
      ([groupName, curveData]: [string, any]) => ({
        x: curveData[0],
        y: curveData[1],
        name: groupName,
        color: 'black',
        dash: this.getDashForGroup(groupName),
      })
    );

    // Heatmaps by function
    const heatmapsByFunction: Record<string, number[][]> = module.uncertainty_constraint ?? {};

    // Points
    const points = Array.isArray(module.kpis?.uncertainty)
      ? [this.createUncertaintyPoint('Presenze', module.kpis?.uncertainty) as Point] : [];

    // KPIs
    const kpis = module.kpis && typeof module.kpis === 'object'
      ? {
        overtourism_level: module.kpis.overtourism_level ?? 0,
        critical_constraint: {
          name: module.kpis['critical constraint']?.name ?? '',
          level: module.kpis['critical constraint']?.level ?? 0
        },
        constraint_level_parcheggi: module.kpis['constraint level parcheggi'] ?? 0,
        constraint_level_spiaggia: module.kpis['constraint level spiaggia'] ?? 0,
        constraint_level_alberghi: module.kpis['constraint level alberghi'] ?? 0,
        constraint_level_ristoranti: module.kpis['constraint level ristoranti'] ?? 0,
        uncertainty: Array.isArray(module.points.uncertainty)
          ? module.points.uncertainty.map((u: {
            usage: number;
            usage_uncertainty: number; tourists: any; excursionists: any; index: any;
          }) => ({
            tourists: u.tourists ?? 0,
            excursionists: u.excursionists ?? 0,
            index: u.index ?? 0,
            usage: u.usage ?? 0,
            usage_uncertainty: u.usage_uncertainty ?? 0,
          }))
          : [],
        uncertainty_by_constraint: module.points.uncertainty_by_constraint && typeof module.points.uncertainty_by_constraint === 'object'
          ? Object.fromEntries(
            Object.entries(module.points.uncertainty_by_constraint).map(([key, value]) => [
              key,
              Array.isArray(value)
                ? value.map(u => ({
                  tourists: u.tourists ?? 0,
                  excursionists: u.excursionists ?? 0,
                  index: u.index ?? 0,
                  usage: u.usage ?? 0,
                  usage_uncertainty: u.usage_uncertainty ?? 0,
                }))
                : []
            ])
          )
          : {}
      }
      : undefined;

    // Main return
    return {
      curves,
      heatmap: module.uncertainty
        ? {
          x: module.x?.[0] ?? [],
          y: module.y?.map((row: number[]) => row[0]) ?? [],
          z: module.uncertainty,
        }
        : undefined,
      xMax: module.x_max,
      yMax: module.y_max,
      points,
      heatmapsByFunction,
      usage: module.usage ?? [],
      sample_t: module.sample_t ?? [],
      sample_e: module.sample_e ?? [],
      capacity: module.capacity ?? [],
      capacity_mean: module.capacity_mean,
      kpis,
      usage_by_constraint: module.usage_by_constraint ?? {},
      capacity_by_constraint: module.capacity_by_constraint ?? {},
      capacity_mean_by_constraint: module.capacity_mean_by_constraint ?? {}
    };
  }
  renderBidimensionale(sottosistemaSelezionato: string, container: HTMLElement, cloned: PlotInput) {
    const uncertaintyData = this.getUncertaintyData(sottosistemaSelezionato, cloned.kpis);
    cloned.points = [this.createUncertaintyPoint('Presenze', uncertaintyData) as Point];
    this.renderFunctionPlot(sottosistemaSelezionato, container, cloned);
  }
  async renderMonoDimensionale(sottosistemaSelezionato: string, container: HTMLElement, input: PlotInput): Promise<void> {
    if (!container || !input?.kpis) return;

    const uncertaintyData = this.getUncertaintyData(sottosistemaSelezionato, input.kpis);
    
    if (!uncertaintyData.length) return;

    // Ordina per usage crescente
    const sorted = [...uncertaintyData].sort((a, b) => a.usage - b.usage);

    const x = sorted.map((_, i) => i);                      // 0,1,2,...
    const y = sorted.map(d => d.usage);                     // valore da plottare verticalmente
    const colorValues = sorted.map(d => d.usage_uncertainty); // per colori
    const risk = sorted.map(d => 100 * d.usage_uncertainty);

    const usageMax = Math.max(...y);
    const yAxisMax = usageMax * 1.2;

    const trace: Partial<Plotly.PlotData> = {
      x,
      y,
      customdata: risk,
      type: 'scatter',
      mode: 'markers',
      name: 'Presenze',
      marker: {
        color: colorValues,
        colorscale: RISK_COLOR_SCALE,
        cmin: 0,
        cmax: 1,
        size: 8,

      },
      hovertemplate: 'Giorno: %{x}<br>Utilizzo: %{y}%<br>Livello di rischio: %{customdata:.4f}%<extra></extra>'
    };

    const layout: Partial<Plotly.Layout> = {
      ...DEFAULT_LAYOUT,
      xaxis: {
        title: { text: 'Giorni (ordinati per utilizzo)' },
        tickformat: '.0f'
      },
      yaxis: {
        title: {
          text:
            sottosistemaSelezionato === 'default' ?
              'Livello di utilizzo della destinazione' :
              'Livello di utilizzo della risorsa ' + sottosistemaSelezionato
        },
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

    const capacityMean = sottosistemaSelezionato === 'default' ?
      input.capacity_mean :
      input.capacity_mean_by_constraint?.[sottosistemaSelezionato];
    const traceCapacityMean: Partial<Plotly.PlotData> = {
      x,
      y: Array(x.length).fill(capacityMean),
      type: 'scatter',
      mode: 'lines',
      name: this.getCapacityLabel(sottosistemaSelezionato),
      line: { color: PLOT_COLORS.capacityMean, dash: 'dash', width: 2 },
      yaxis: 'y1',
      showlegend: true,
    };
    const traces: Partial<Plotly.PlotData>[] = [
      traceCapacityMean
    ];

    traces.push(trace);
    this.renderPlot(container, traces, layout);
  }
  getCapacityLabel(subsystem: string): string {
    return subsystem === 'default' ? 'Soglia di sovraffollamento' : 'Capacità di carico';
  }
  async renderPlot(container: HTMLElement, data: any[], layout = DEFAULT_LAYOUT) {
    try {
      const plot = await Plotly.newPlot(container, data, layout, { responsive: true });
      this.disableLegendInteraction(plot);
    } catch (e) {
      console.error('Errore nel rendering Plotly:', e);
    }
  }
  private disableLegendInteraction(container: any) {
    container.on?.('plotly_legendclick', () => false);
    container.on?.('plotly_legenddoubleclick', () => false);
  }
  private getDefaultHoverTemplate(): string {
    return '<b>Livello di rischio:</b> %{customdata:.4f}%<br>' +
      '<b>Turisti:</b> %{x}<br>' +
      '<b>Escursionisti:</b> %{y}<br>' +
      '<extra></extra>';
  }
  private getUncertaintyData(sottosistema: string, points: any): any[] {
    if (!points) return [];
    return sottosistema === 'default'
      ? (Array.isArray(points['uncertainty']) ? points['uncertainty'] : [])
      : (points['uncertainty_by_constraint']?.[sottosistema] ?? []);
  }
  private createUncertaintyPoint(
    name: string,
    data: any[],
    showScale: boolean = false
  ): Point {
    return {
      name,
      x: data.map(p => p.tourists),
      y: data.map(p => p.excursionists),
      customdata: data.map(p => 100 * (1 - p.index)),
      marker: {
        color: data.map(p => p.index),
        colorscale: RISK_COLOR_SCALE,
        reversescale: true,
        cmin: 0,
        cmax: 1,
        size: 6,
        showscale: showScale,

      },
      mode: 'markers',
      type: 'scatter',
      hovertemplate: this.getDefaultHoverTemplate(),
      showlegend: false
    };
  }


}
