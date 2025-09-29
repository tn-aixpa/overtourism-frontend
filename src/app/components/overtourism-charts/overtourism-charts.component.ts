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
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateComuni();
    this.drawChart();
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
    }

  }

  drawChart() {
    if (!this.data?.length || !this.chartEl?.nativeElement || !this.selectedKpi || !this.selectedComuni?.length) return;
  
    // calcola tutti gli anni unici dai comuni selezionati
    const anni = Array.from(new Set(
      this.selectedComuni.flatMap(comune => 
        this.data.filter(d => d.comune === comune).map(d => d.anno)
      )
    )).sort((a, b) => a - b);
  
    const chartData: Plotly.Data[] = this.selectedComuni.map(comune => {
      const datiComune = this.data.filter(d => d.comune === comune);
      
      // mappa valori sull'array completo degli anni, usa null se manca
      const valori = anni.map(y => {
        const record = datiComune.find(d => d.anno === y);
        return record ? record[this.selectedKpi!] : null;
      });
  
      return {
        x: anni,
        y: valori,
        type: this.chartType,
        mode: this.chartType === 'scatter' ? 'lines+markers' : undefined,
        name: comune
      } as Plotly.Data;
    });
  
    const layout: Partial<Plotly.Layout> = { 
      ...this.layout, 
      xaxis: { 
        ...this.layout.xaxis, 
        type: 'category' as Plotly.AxisType 
      } 
    };
  
    Plotly.react(this.chartEl.nativeElement, chartData, layout, { responsive: true });
  }
  
  
}
