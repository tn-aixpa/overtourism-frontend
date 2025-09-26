import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-histogram-comparison',
  templateUrl: './histogram-comparison.component.html',
  styleUrls: ['./histogram-comparison.component.scss'],
  standalone: false
})
export class HistogramComparisonComponent implements AfterViewInit, OnChanges {
  @Input() dataLeft: Record<string, { level: number; confidence: number }> = {};
  @Input() dataRight: Record<string, { level: number; confidence: number }> = {};
  @Input() labelLeft: string = 'Scenario 1';
  @Input() labelRight: string = 'Scenario 2';

  @ViewChild('histogramChart', { static: false }) chartEl!: ElementRef;

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataLeft'] || changes['dataRight']) {
      this.renderChart();
    }
  }
  private wrapLabel(label: string, maxChars = 12): string {
    // spezza le parole lunghe ogni maxChars caratteri circa
    return label.replace(
      new RegExp(`(.{1,${maxChars}})(\\s|$)`, 'g'),
      '$1<br>'
    );
  }
  private renderChart(): void {
    if (!this.chartEl?.nativeElement) return;
  
    const categories = Array.from(new Set([
      ...Object.keys(this.dataLeft || {}),
      ...Object.keys(this.dataRight || {})
    ]));
    const wrappedCategories = categories.map(c => this.wrapLabel(c));
  
    // estrai level e confidence
    const valuesLeft = categories.map(c => +(this.dataLeft[c]?.level ?? 0));
    const errorsLeft = categories.map(c => +(this.dataLeft[c]?.confidence ?? 0));
  
    const valuesRight = categories.map(c => +(this.dataRight[c]?.level ?? 0));
    const errorsRight = categories.map(c => +(this.dataRight[c]?.confidence ?? 0));
  
    // arrotonda per visualizzazione
    const displayLeft = valuesLeft.map(v => +v.toFixed(1));
    const displayRight = valuesRight.map(v => +v.toFixed(1));
    const errLeftRounded = errorsLeft.map(e => +e.toFixed(1));
    const errRightRounded = errorsRight.map(e => +e.toFixed(1));
  
    const barWidth = 0.38;      // larghezza principale di ciascun gruppo
  
    // LEFT barre principali blu
    const leftMain: any = {
      x: wrappedCategories,
      y: displayLeft,
      name: this.labelLeft,
      type: 'bar',
      marker: { color: '#0066CC' },
      offsetgroup: 'left',
      width: barWidth
    };
  
    // LEFT fascia gialla con testo
    const leftConf: any = {
      x: wrappedCategories,
      y: errLeftRounded.map(e => e * 2),
      base: displayLeft.map((v, i) => v - errLeftRounded[i]),
      type: 'bar',
      marker: { color: '#e7b66e' },
      opacity: 1,
      name: `${this.labelLeft} conf`,
      hoverinfo: 'skip',
      showlegend: false,
      offsetgroup: 'left',
      width: barWidth,
      text: displayLeft.map(v => v.toFixed(1)),
      textposition: 'outside'
    };
  
    // LEFT linea nera sul livello
    const leftLevelLine: any = {
      x: wrappedCategories,
      y: displayLeft.map(() => 0.02), // spessore sottile della linea
      base: displayLeft,
      type: 'bar',
      marker: { color: 'black' },
      hoverinfo: 'skip',
      showlegend: false,
      offsetgroup: 'left',
      width: barWidth
    };
  
    // RIGHT barre principali grigie
    const rightMain: any = {
      x: wrappedCategories,
      y: displayRight,
      name: this.labelRight,
      type: 'bar',
      marker: { color: '#D9D9D9' },
      offsetgroup: 'right',
      width: barWidth
    };
  
    // RIGHT fascia gialla con testo
    const rightConf: any = {
      x: wrappedCategories,
      y: errRightRounded.map(e => e * 2),
      base: displayRight.map((v, i) => v - errRightRounded[i]),
      type: 'bar',
      marker: { color: '#e7b66e' },
      opacity: 1,
      name: `${this.labelRight} conf`,
      hoverinfo: 'skip',
      showlegend: false,
      offsetgroup: 'right',
      width: barWidth,
      text: displayRight.map(v => v.toFixed(1)),
      textposition: 'outside'
    };
  
    // RIGHT linea nera sul livello
    const rightLevelLine: any = {
      x: wrappedCategories,
      y: displayRight.map(() => 0.02),
      base: displayRight,
      type: 'bar',
      marker: { color: 'black' },
      hoverinfo: 'skip',
      showlegend: false,
      offsetgroup: 'right',
      width: barWidth
    };
    const uncertaintyLegend: any = {
      x: [null],
      y: [null],
      type: 'bar',
      marker: { color: '#e7b66e' },
      name: 'Incertezza',   
      showlegend: true,
      hoverinfo: 'skip'
    };
    // Layout
    const layout: Partial<Plotly.Layout> = {
      barmode: 'group',
      margin: { t: 20, r: 20, l: 40, b: 70 },
      legend: {
        orientation: 'h',
        y: -0.25,    
        x: 0.5,
        xanchor: 'center'
      },
      xaxis: { automargin: true },
      yaxis: { automargin: true }
    };
  
    // Ordine dei trace: barre principali -> fasce gialle -> linee nere
    const traces: any[] = [
      leftMain, rightMain,
      leftConf, rightConf,
      leftLevelLine, rightLevelLine,
      uncertaintyLegend
    ];
  
    Plotly.newPlot(this.chartEl.nativeElement, traces, layout, { responsive: true });
  }
  
}  
