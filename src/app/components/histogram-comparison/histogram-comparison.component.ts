import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-histogram-comparison',
  templateUrl: './histogram-comparison.component.html',
  styleUrls: ['./histogram-comparison.component.scss'],
  standalone: false
})
export class HistogramComparisonComponent implements AfterViewInit, OnChanges {
  @Input() dataLeft: Record<string, number> = {};
  @Input() dataRight: Record<string, number> = {};
  @Input() labelLeft: string = 'Scenario 1';
  @Input() labelRight: string = 'Scenario 2';

  @ViewChild('histogramChart', { static: true }) chartEl!: ElementRef;

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
    if (!this.chartEl) return;

    const categories = Array.from(new Set([
      ...Object.keys(this.dataLeft || {}),
      ...Object.keys(this.dataRight || {})
    ]));
    const wrappedCategories = categories.map(c => this.wrapLabel(c));

    const valuesLeft = categories.map(c => this.dataLeft[c] ?? 0);
    const valuesRight = categories.map(c => this.dataRight[c] ?? 0);

    const traceLeft: Partial<Plotly.Data> = {
      x: wrappedCategories,
      y: valuesLeft,
      name: this.labelLeft,
      type: 'bar',
      marker: { color: '#0066CC' },
      text: valuesLeft.map(v => v.toFixed(2)),   // mostra valore come stringa
      textposition: 'outside',                   // fuori sopra la barra
      // hovertemplate: '%{y:.2f}<extra></extra>'  
       hoverinfo: 'skip'
    };

    const traceRight: Partial<Plotly.Data> = {
      x: wrappedCategories,
      y: valuesRight,
      name: this.labelRight,
      type: 'bar',
      marker: { color: '#D9D9D9' },
      text: valuesLeft.map(v => v.toFixed(2)),   // mostra valore come stringa
      textposition: 'outside',                   // fuori sopra la barra
      // hovertemplate: '%{y:.2f}<extra></extra>'  
       hoverinfo: 'skip'
    };

    const layout: Partial<Plotly.Layout> = {
      barmode: 'group',
      margin: { t: 20, r: 20, l: 40, b: 40 },
      legend: { orientation: 'h' }
    };

    Plotly.newPlot(this.chartEl.nativeElement, [traceLeft, traceRight], layout, { responsive: true });
  }
}
