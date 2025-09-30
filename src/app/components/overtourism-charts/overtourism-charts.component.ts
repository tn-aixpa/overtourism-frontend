import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

@Component({
  selector: 'app-overtourism-charts',
  templateUrl: './overtourism-charts.component.html',
  standalone: false,
  styleUrls: ['./overtourism-charts.component.scss']
})
export class OvertourismChartsComponent implements OnChanges, AfterViewInit {

  @Input() data: any[] = [];
  @Input() selectedKpi: string | null = null;
  @ViewChild('histogramChart', { static: false }) chartEl!: ElementRef;
  @ViewChild('comuneAuto') comuneAuto!: AutocompleteComponent;
  @Input() kpis: { key: string; title: string; dataset: string; other: string[]; map: string }[] = [];

  private resizeObserver?: ResizeObserver;

  comuni: string[] = [];
  selectedComuni: string[] = [];   // multiselect
  chartType: 'scatter' | 'bar' = 'scatter';

  private lastSignature: string | null = null;

  private viewReady = false;  
   indexInfo = this.kpis.find(k => k.key === this.selectedKpi);

  layout: Partial<Plotly.Layout> = {
    xaxis: { title: { text: 'Anno' }, tickformat: 'd' }, // solo interi
    yaxis: { title: { text:  this.indexInfo ? this.indexInfo.title : 'Valore'  } },
    legend: { orientation: 'h', y: -0.3 }
  };

  ngAfterViewInit() {
    this.viewReady = true;
      this.tryDraw();
    if (this.chartEl?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chartEl?.nativeElement) {
          Plotly.Plots.resize(this.chartEl.nativeElement);
        }
      });
      this.resizeObserver.observe(this.chartEl.nativeElement);
    }
  }
  
  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.updateComuni();
    this.tryDraw();
  }

  private tryDraw() {
    if (!this.readyToDraw()) return;

    const signature = JSON.stringify({
      comuni: this.selectedComuni,
      kpi: this.selectedKpi,
      len: this.data.length,
      chartType: this.chartType
    });

    if (this.lastSignature !== signature) {
      this.lastSignature = signature;
      this.drawChart();
    }
  }

  private readyToDraw(): boolean {
    return !!(
      this.viewReady &&  
      this.chartEl?.nativeElement &&
      this.data?.length &&
      this.selectedKpi &&
      this.selectedComuni?.length
    );
  }

  private updateComuni() {
    if (this.data?.length) {
      this.comuni = Array.from(new Set(this.data.map(d => d.comune))).sort();
      if (!this.selectedComuni.length) {
        this.selectedComuni = this.comuni.includes('MOLVENO')
          ? ['MOLVENO']
          : [this.comuni[0]];
      }
    }
  }

  drawChart() {
    if (!this.chartEl?.nativeElement) return;
  
    if (!(this.data?.length && this.selectedKpi && this.selectedComuni?.length)) {
      // niente requisiti minimi → cancella grafico
      Plotly.purge(this.chartEl.nativeElement);
      return;
    }
  
    const indexInfo = this.kpis.find(k => k.key === this.selectedKpi);
  
    const anni = Array.from(new Set(
      this.selectedComuni.flatMap(comune =>
        this.data.filter(d => d.comune === comune).map(d => d.anno)
      )
    )).sort((a, b) => a - b);
  
    const chartData: Plotly.Data[] = this.selectedComuni.map(comune => {
      const datiComune = this.data.filter(d => d.comune === comune);
  
      const valori = anni.map(y => {
        const record = datiComune.find(d => d.anno === y);
        return record ? record[this.selectedKpi!] : null;
      });
  
      const hoverText = anni.map(y => {
        const record = datiComune.find(d => d.anno === y);
        if (!record || !indexInfo) return '';
        return [
          `Comune: ${comune}`,
          `Anno: ${y}`,
          `${indexInfo.title}: ${typeof record[this.selectedKpi!] === 'number' ? record[this.selectedKpi!].toFixed(2) : record[this.selectedKpi!]}`,
          ...indexInfo.other.map(f => `${f}: ${typeof record[f] === 'number' ? record[f].toFixed(2) : record[f]}`)
        ].join('<br>');
      });
  
      return {
        x: anni,
        y: valori,
        type: this.chartType,
        mode: this.chartType === 'scatter' ? 'lines+markers' : undefined,
        name: comune,
        text: hoverText,
        hoverinfo: 'text',
        textposition: 'none'  
      } as Plotly.Data;
    });
  
    const layout: Partial<Plotly.Layout> = {
      ...this.layout,
      xaxis: { ...this.layout.xaxis, type: 'category' as Plotly.AxisType },
      yaxis: { ...this.layout.yaxis, title: { text: indexInfo ? indexInfo.title : 'Valore' } }

    };
  
    Plotly.react(this.chartEl.nativeElement, chartData, layout, { responsive: true });
  }
  

  
  toggleComune(comune: string) {
    if (this.selectedComuni.includes(comune)) {
      this.selectedComuni = this.selectedComuni.filter(c => c !== comune);
    } else {
      this.selectedComuni = [...this.selectedComuni, comune];
    }
    this.drawChart();
  }
  onComuneSelected(comune: string) {
    if (!this.selectedComuni.includes(comune)) {
      this.selectedComuni.push(comune);
    }
  
    this.comuneAuto.inputEl?.nativeElement.blur();
  
    this.comuneAuto.clear();
    this.drawChart();

  }
  removeComune(comune: string) {
    this.selectedComuni = this.selectedComuni.filter(c => c !== comune);
    this.drawChart();
  }
  
  
  
  
  
}
