// src/app/plot.model.ts

import { ScatterMarker, ColorScale, PlotType } from "plotly.js-dist-min";


export type Curve = {
  x: number[];
  y: number[];
  name: string;
  color?: string;
  dash?: 'solid' | 'dot' | 'dash' | 'dashdot';
};

export type Heatmap = {
  x: number[];
  y: number[];
  z: number[][];
};

export interface Point {
  name: string;
  x: number[];
  y: number[];
  color?: string | string[];
  marker?: any;
  customdata?: any[];
  hovertemplate?: string;
  mode?: any;
  type?: any;
  showlegend?: boolean;
}


export interface CriticalConstraint {
  name: string;
  level: number;
}

// export interface KPIs {
//   area: number;
//   overtourism_level: number;
//   critical_constraint: CriticalConstraint;
//   constraint_level_parcheggi: number;
//   constraint_level_spiaggia: number;
//   constraint_level_alberghi: number;
//   constraint_level_ristoranti: number;
// }
export interface KPIs {
  [key: string]: number | undefined | { name: string; level: number };
}

export interface PlotInput {
  curves: Curve[];
  heatmap?: { x: number[]; y: number[]; z: number[][] };
  xMax?: number;
  yMax?: number;
  points: Point[];
  heatmapsByFunction?: Record<string, number[][]>;
  usage?: number[];
  sample_t?: number[];
  sample_e?: number[];
  capacity?: number[][];
  capacity_mean?: number;
  kpis?: KPIs;
  usage_by_constraint?: Record<string, number[]>;
  capacity_by_constraint?: Record<string, number[][]>;
  capacity_mean_by_constraint?: Record<string, number>;
}



