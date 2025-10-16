import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { KpiInfo } from '../../pages/overtourism/flows/flows.component';

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
  @Input() kpis: KpiInfo[] = [];
  @Input() hoverTemplateBuilder?: (record: any, alias?: Record<string, string>) => string;

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
  get availableComuni(): string[] {
    return this.comuni.filter(c => !this.selectedComuni.includes(c));
  }
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
    if (changes['data'] && this.data?.length) {
      this.updateComuni();
      this.tryDraw();
    }
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
      console.log('Dati insufficienti per disegnare il grafico');
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
      console.log(`Dati per il comune ${comune}:`, datiComune);
      const valori = anni.map(y => {
        const record = datiComune.find(d => d.anno === y);
        console.log(`Valore per anno ${y} nel comune ${comune}:`, record ? record[this.selectedKpi!] : null);
        return record ? record[this.selectedKpi!] : null;
      });
  
      console.log(`Valori per il comune ${comune}:`, valori);
      const hoverText = anni.map(y => {
        const record = datiComune.find(d => d.anno === y);
        if (!record || !indexInfo) return '';
      
        if (this.hoverTemplateBuilder) {
          return this.hoverTemplateBuilder(record, indexInfo.alias);
        }
      
        return Object.entries(record)
          .map(([key, value]) => `${key}: ${value}`)
          .join('<br>');
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
console.log("print");
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
