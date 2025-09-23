import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-overtourism-charts',
  standalone: false,
  templateUrl: './overtourism-charts.component.html',
  styleUrls: ['./overtourism-charts.component.scss']
})
export class OvertourismChartsComponent implements OnChanges, AfterViewInit {

  @Input() data: any[] = [];
  @Input() selectedKpi: string | null = null;  // KPI opzionale
  @ViewChild('histogramChart', { static: false }) chartEl!: ElementRef;

  selectedComune: string | null = null;
  comuni: string[] = [];
  private chartInitialized = false;

  layout: Partial<Plotly.Layout> = {
    title: { text: 'Andamento Overtourism' },
    xaxis: { title: { text: 'Anno' } },
    yaxis: { title: { text: 'Valore' } },
    legend: { orientation: 'h', y: -0.2 }
  };
  selectComune(_t15: string) {
    this.selectedComune = _t15;
    this.drawChart();
  }
  ngAfterViewInit() {
    this.chartInitialized = true;
    this.updateComuni();
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateComuni();
    this.drawChart();
  }

  private updateComuni() {
    if (this.data?.length) {
      this.comuni = Array.from(new Set(this.data.map(d => d.comune))).sort();
      if (!this.selectedComune) this.selectedComune = this.comuni[0];
    }
  }

  drawChart() {
    // Se non c'è data, comune o KPI selezionato, non disegnare
    if (!this.data?.length || !this.chartEl?.nativeElement || !this.selectedKpi || !this.selectedComune) return;

    const datiComune = this.data.filter(d => d.comune === this.selectedComune);

    const chartData: Plotly.Data[] = [
      {
        x: datiComune.map(d => d.anno),
        y: datiComune.map(d => d[this.selectedKpi!]),
        type: 'scatter',
        mode: 'lines+markers',
        name: this.selectedKpi
      }
    ];

    Plotly.react(this.chartEl.nativeElement, chartData, this.layout, { responsive: true });
  }
}
