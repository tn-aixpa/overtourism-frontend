import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dataExample from '../../assets/dataExample.json'; 
import { PlotInput, Curve } from '../models/plot.model';
import Plotly from 'plotly.js-dist-min';

@Injectable({ providedIn: 'root' })
export class PlotService {
  constructor(private http: HttpClient) {}

  getDashForGroup(groupName: string): 'solid' | 'dot' | 'dash' | 'dashdot' {
    const dashes: Record<string, 'solid' | 'dot' | 'dash' | 'dashdot'> = {
      parcheggi: 'solid',
      spiaggia: 'dot',
      alberghi: 'dash',
      ristoranti: 'dashdot',
    };
    return dashes[groupName] ?? 'solid';
  }

  async fetchPlotData(): Promise<PlotInput> {
    const module = dataExample;

    const allCurves: Curve[] = [];
    if (module.constraint_curves) {
      for (const [groupName, curveData] of Object.entries(module.constraint_curves)) {
        const xPoints = curveData[0];
        const yPoints = curveData[1];
        allCurves.push({
          x: xPoints,
          y: yPoints,
          name: groupName,
          color: 'black',
          dash: this.getDashForGroup(groupName),
        });
      }
    }

    const xAxis = module.x?.[0] ?? [];
    const yAxis = module.y?.map((row: number[]) => row[0]) ?? [];

    const sampleX = module.sample_t ?? [];
    const sampleY = module.sample_e ?? [];

    const puntiCampione = {
      name: 'Campioni osservati',
      x: sampleX,
      y: sampleY,
      color: 'black',
    };

    const heatmapsByFunction: Record<string, number[][]> = module.uncertainty_constraint ?? {};

    return {
      curves: allCurves,
      heatmap: module.uncertainty ? {
        x: xAxis,
        y: yAxis,
        z: module.uncertainty,
      } : undefined,
      xMax: module.x_max,
      yMax: module.y_max,
      points: [puntiCampione],
      heatmapsByFunction,
      usage: module.usage ?? [],
      sample_t: sampleX,
      sample_e: sampleY,
      capacity: module.capacity ?? [],
      capacity_mean: module.capacity_mean,
      kpis: module.kpis ?? undefined,

      // kpis: module.kpis ? {
      //   area: module.kpis.area ?? 0,
      //   overtourism_level: module.kpis.overtourism_level ?? 0,
      //   critical_constraint: {
      //     name: module.kpis['critical constraint']?.name ?? '',
      //     level: module.kpis['critical constraint']?.level ?? 0
      //   },
      //   constraint_level_parcheggi: module.kpis['constraint level parcheggi'] ?? 0,
      //   constraint_level_spiaggia: module.kpis['constraint level spiaggia'] ?? 0,
      //   constraint_level_alberghi: module.kpis['constraint level alberghi'] ?? 0,
      //   constraint_level_ristoranti: module.kpis['constraint level ristoranti'] ?? 0
      // } : undefined,
      usage_by_constraint: module.usage_by_constraint ?? {},
      capacity_by_constraint: module.capacity_by_constraint ?? {},
      capacity_mean_by_constraint: module.capacity_mean_by_constraint ?? {}
    };
  }
  //   renderFunctionPlot(container: HTMLElement, input: PlotInput) {
  //   const data: Partial<Plotly.PlotData>[] = [];
  
  //   if (input.heatmap) {
  //     data.push({
  //       z: input.heatmap.z,
  //       x: input.heatmap.x,
  //       y: input.heatmap.y,
  //       type: 'heatmap',
  //       colorscale: [
  //         [0, 'rgb(0,0,255)'],       // blu per 0
  //         [0.5, 'rgb(255,255,255)'], // bianco
  //         [1, 'rgb(150,0,24)']       // rosso scuro per 1
  //       ],
  //       zmin: 0,
  //       zmax: 1,
  //       showscale: true,
  //       hovertemplate: 'x: %{x}<br>y: %{y}<br>z: %{z}<extra></extra>'
  //     });
  //   }
  
  //   for (const curve of input.curves) {
  //     data.push({
  //       x: curve.x,
  //       y: curve.y,
  //       mode: 'lines',
  //       name: curve.name,
  //       line: {
  //         color: curve.color ?? 'black',
  //         dash: curve.dash ?? 'solid',
  //         width: 3,
  //       },
  //       hoverinfo: 'name',
  //       type: 'scatter',
  //     });
  //   }
  
  //   if (input.points?.length) {
  //     for (const pt of input.points) {
  //       data.push({
  //         x: pt.x,
  //         y: pt.y,
  //         type: 'scatter',
  //         mode: 'markers',
  //         name: pt.name,
  //         marker: {
  //           color: pt.color ?? 'black',
  //           size: 8,
  //           line: {
  //             width: 1,
  //             color: 'black',
  //           },
  //         },
  //         hoverinfo: 'x+y+name',
  //       });
  //     }
  //   }
  
  //   const layout: Partial<Plotly.Layout> = {
  //     title: { text: 'Scenario con Heatmap' },
  //     xaxis: {
  //       title: { text: 'Turisti' },
  //       range: [0, input.xMax ?? undefined],
  //     },
  //     yaxis: {
  //       title: { text:'Escursionisti'},
  //       range: [0, input.yMax ?? undefined],
  //     },
  //     margin: { l: 60, r: 30, t: 40, b: 50 },
  //     showlegend: true,
  //     legend: {
  //       orientation: 'h',
  //       x: 0,
  //       y: -0.2,
  //       xanchor: 'left',
  //       yanchor: 'top',
  //     }
  //   };
  
  //   Plotly.newPlot(container, data, layout, { responsive: true });
  // }
}