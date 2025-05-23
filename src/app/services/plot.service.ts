import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dataExample from '../../assets/dataExample.json'; 
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
      kpis: module.kpis ? {
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
      } : undefined,
      usage_by_constraint: module.usage_by_constraint ?? {},
      capacity_by_constraint: module.capacity_by_constraint ?? {},
      capacity_mean_by_constraint: module.capacity_mean_by_constraint ?? {}
    };
  }
}