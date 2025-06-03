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
    const points = module.sample_t && module.sample_e
      ? [{
          name: 'Campioni osservati',
          x: module.sample_t,
          y: module.sample_e,
          color: 'black',
        }]
      : [];

    // KPIs
    const kpis = module.kpis && typeof module.kpis === 'object'
      ? {
          area: module.kpis.area ?? 0,
          overtourism_level: module.kpis.overtourism_level ?? 0,
          critical_constraint: {
            name: module.kpis['critical constraint']?.name ?? '',
            level: module.kpis['critical constraint']?.level ?? 0
          },
          constraint_level_parcheggi: module.kpis['constraint level parcheggi'] ?? 0,
          constraint_level_spiaggia: module.kpis['constraint level spiaggia'] ?? 0,
          constraint_level_alberghi: module.kpis['constraint level alberghi'] ?? 0,
          constraint_level_ristoranti: module.kpis['constraint level ristoranti'] ?? 0
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