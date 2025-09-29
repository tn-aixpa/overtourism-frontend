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


  comuni: string[] = [];
  selectedComuni: string[] = [];   // multiselect
  chartType: 'scatter' | 'bar' = 'scatter';

  private chartInitialized = false;

  layout: Partial<Plotly.Layout> = {
    title: { text: 'Andamento Overtourism' },
    xaxis: { title: { text: 'Anno' }, tickformat: 'd' }, // solo interi
    yaxis: { title: { text: 'Valore' } },
    legend: { orientation: 'h', y: -0.3 }
  };

  ngAfterViewInit() {
    this.chartInitialized = true;
    this.updateComuni();
    if(this.readyToDraw()) {
      this.drawChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateComuni();
    if(this.readyToDraw()) {
      this.drawChart();
    }
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
  private updateComuni() {
    if (this.data?.length) {
      this.comuni = Array.from(new Set(this.data.map(d => d.comune))).sort();
      if(this.comuni.includes('MOLVENO')) {
        this.selectedComuni = ['MOLVENO'];
      } else if(this.comuni.length) {
        this.selectedComuni = [this.comuni[0]];
      }
    }
  }
  private readyToDraw(): boolean {
    return !!(this.chartEl?.nativeElement && this.data?.length && this.selectedKpi && this.selectedComuni?.length);
  }
  drawChart() {
    if (!this.readyToDraw()) return;
  
    const indexInfo = this.kpis.find((k: { key: string | null; }) => k.key === this.selectedKpi);
  
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
      
        const lines = [
          `Comune: ${comune}`,
          `Anno: ${y}`,
          `${indexInfo.title}: ${record[this.selectedKpi!]}`,
          ...indexInfo.other.map(f => `${f}: ${record[f]}`)
        ];
      
        return lines.join('<br>');
      });
  
      return {
        x: anni,
        y: valori,
        type: this.chartType,
        mode: this.chartType === 'scatter' ? 'lines+markers' : undefined,
        name: comune,
        text: hoverText,
        hoverinfo: 'text'
      } as Plotly.Data;
    });
  
    const layout: Partial<Plotly.Layout> = { 
      ...this.layout, 
      xaxis: { ...this.layout.xaxis, type: 'category' as Plotly.AxisType } 
    };
  
    Plotly.react(this.chartEl.nativeElement, chartData, layout, { responsive: true });
  }
  
  
  
}
