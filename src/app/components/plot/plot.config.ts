// plot.config.ts
export const SUBSYSTEM_OPTIONS = [
    { value: 'default', label: 'Tutti' },
    { value: 'parcheggi', label: 'Parcheggi' },
    { value: 'spiaggia', label: 'Spiaggia' },
    { value: 'alberghi', label: 'Alberghi' },
    { value: 'ristoranti', label: 'Ristoranti' }
  ];
  
  export const PLOT_COLORS = {
    sampleT: 'rgba(211, 211, 211, 0.7)',      // Light gray
    sampleE: 'rgba(64, 64, 64, 0.7)',         // Dark gray
    overThreshold: '#BA0C2F',
    underThreshold: '#32CD32',
    capacityMean: 'red',
  };
  
  export const HEATMAP_COLOR_SCALE: [number, string][] = [
    [0, 'rgb(0,0,255)'],
    [0.5, 'rgb(255,255,255)'],
    [1, 'rgb(150, 0, 24)']
  ];
  
  export const DEFAULT_LAYOUT: Partial<Plotly.Layout> = {
    height: 500,
    width: 800,
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0,
      y: -0.2,
      xanchor: 'left',
      yanchor: 'top'
    },
    margin: { l: 60, r: 60, t: 40, b: 50 }
  };
  