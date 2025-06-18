import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlotInput, Curve } from '../models/plot.model';

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
    ? [{
        name: 'Incertezza',
        x: module.kpis.uncertainty.map((p: any) => p.tourists),
        y: module.kpis.uncertainty.map((p: any) => p.excursionists),
        customdata: module.kpis.uncertainty.map((p: any) => p.index),
        marker: {
          color: module.kpis.uncertainty.map((p: any) => p.index),
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
          size: 6,
          line: {
            color: 'black',
            width: 1
          },
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
      }]
    : [];

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
          uncertainty: Array.isArray(module.kpis.uncertainty)
          ? module.kpis.uncertainty.map((u: { tourists: any; excursionists: any; index: any; }) => ({
              tourists: u.tourists ?? 0,
              excursionists: u.excursionists ?? 0,
              index: u.index ?? 0
            }))
          : [],
        uncertainty_by_constraint: module.kpis.uncertainty_by_constraint && typeof module.kpis.uncertainty_by_constraint === 'object'
          ? Object.fromEntries(
              Object.entries(module.kpis.uncertainty_by_constraint).map(([key, value]) => [
                key,
                Array.isArray(value)
                  ? value.map(u => ({
                      tourists: u.tourists ?? 0,
                      excursionists: u.excursionists ?? 0,
                      index: u.index ?? 0
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
}