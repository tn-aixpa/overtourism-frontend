// src/app/plot.model.ts


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

export type Point = {
  x: number[];
  y: number[];
  name: string;
  color?: string | string[];
};

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

export type PlotInput = {
  curves: Curve[];
  heatmap?: Heatmap;
  points?: Point[];
  heatmapsByFunction?: Record<string, number[][]>;
  xMax?: number;
  yMax?: number;
  usage?: number[];
  usage_by_constraint?: Record<string, number[]>;
  capacity_by_constraint?: Record<string, number[][]>;
  capacity_mean_by_constraint?: Record<string, number>;
  sample_t?: number[];
  sample_e?: number[];
  capacity?: number[][];
  capacity_mean?: number;
  kpis?: KPIs;  // Add new KPIs property
};


