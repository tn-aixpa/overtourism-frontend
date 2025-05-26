// src/app/plot.model.ts

import Plotly from 'plotly.js-dist-min';

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

export function renderFunctionPlot(container: HTMLElement, input: PlotInput) {
  const data: Partial<Plotly.PlotData>[] = [];

  if (input.heatmap) {
    data.push({
      z: input.heatmap.z,
      x: input.heatmap.x,
      y: input.heatmap.y,
      type: 'heatmap',
      colorscale: [
        [0, 'rgb(0,0,255)'],       // blu per 0
        [0.5, 'rgb(255,255,255)'], // bianco
        [1, 'rgb(150,0,24)']       // rosso scuro per 1
      ],
      zmin: 0,
      zmax: 1,
      showscale: true,
      hovertemplate: 'x: %{x}<br>y: %{y}<br>z: %{z}<extra></extra>'
    });
  }

  for (const curve of input.curves) {
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
      data.push({
        x: pt.x,
        y: pt.y,
        type: 'scatter',
        mode: 'markers',
        name: pt.name,
        marker: {
          color: pt.color ?? 'black',
          size: 8,
          line: {
            width: 1,
            color: 'black',
          },
        },
        hoverinfo: 'x+y+name',
      });
    }
  }

  const layout: Partial<Plotly.Layout> = {
    title: { text: 'Scenario con Heatmap' },
    xaxis: {
      title: { text: 'Turisti' },
      range: [0, input.xMax ?? undefined],
    },
    yaxis: {
      title: { text:'Escursionisti'},
      range: [0, input.yMax ?? undefined],
    },
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
