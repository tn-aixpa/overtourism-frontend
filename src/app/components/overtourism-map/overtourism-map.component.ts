import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

interface ChoroplethMapboxTrace extends Partial<Plotly.PlotData> {
  type: 'choroplethmapbox';
  geojson: any;
  locations: string[];
  z: number[];
  featureidkey: string;
}

@Component({
  selector: 'app-overtourism-map',
  templateUrl: './overtourism-map.component.html',
  styleUrls: ['./overtourism-map.component.scss'],
  standalone: false,
})
export class OvertourismMapComponent implements OnChanges, AfterViewInit {
  @Input() data: any[] = [];
  @Input() geojson: any = null;
  @Input() selectedKpi: string | null = null;
  @Input() kpiAlias: Record<string, string> = {};
  @Input() featureIdKey: string | null = null;
  @Input() locationsCol: string | null = null;
  @Input() active: boolean = true;
  @Input() kpiTicks: [number[], string[]] | null = null;

  @Input() hoverTemplateBuilder?: (record: any, alias?: Record<string, string>) => string;

  @ViewChild('mapChart', { static: false }) mapEl!: ElementRef;

  selectedAnno: number | null = null;
  anniDisponibili: number[] = [];

  ngAfterViewInit() {
    this.tryDrawMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['data'] && this.data?.length) || 
        (changes['geojson'] && this.geojson) || 
        changes['selectedKpi']) {
      if (this.active) {
        this.setupAnni();
        this.tryDrawMap();
      }
    }
    if (changes['active'] && this.active) {
      this.tryDrawMap();
    }
  }

  private tryDrawMap() {
    if (!this.data?.length || !this.geojson || !this.selectedKpi || this.selectedAnno === null) return;
    if (!this.mapEl?.nativeElement) return;
    this.drawMap();
  }

  private setupAnni() {
    if (this.data?.length) {
      this.anniDisponibili = Array.from(new Set(this.data.map(d => d.anno))).sort();
      this.selectedAnno = this.anniDisponibili[this.anniDisponibili.length - 1];
    }
  }
  private wrapLabel(label: string, maxLength: number = 25): string {
    const words = label.split(' ');
    let line = '';
    const lines: string[] = [];
  
    for (const word of words) {
      if ((line + word).length > maxLength) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line += word + ' ';
      }
    }
  
    if (line) lines.push(line.trim());
    return lines.join('<br>');
  }
  drawMap() {
    if (!this.data?.length || !this.geojson || !this.selectedKpi || this.selectedAnno === null) return;
    if (!this.mapEl?.nativeElement) return;

    const datiAnno = this.data.filter(d => d.anno === this.selectedAnno);

    const comuni: string[] = [];
    const valori: number[] = [];
    const hoverTexts: string[] = [];

    this.geojson.features.forEach((feature: any) => {
      const featureId = this.featureIdKey 
        ? feature.properties[this.featureIdKey.split('.').pop()!] 
        : null;
      const datoComune = datiAnno.find(d => d[this.locationsCol!] === featureId);
      
      comuni.push(featureId);
      const valore = datoComune ? datoComune[this.selectedKpi!] : NaN;
      valori.push(valore);

      // 👉 costruzione hover
      if (datoComune && this.hoverTemplateBuilder) {
        hoverTexts.push(this.hoverTemplateBuilder(datoComune));
      } else {
        hoverTexts.push(`${featureId}<br>${this.selectedKpi}: ${valore}`);
      }
    });

    const trace: ChoroplethMapboxTrace = {
      type: 'choroplethmapbox',
      geojson: this.geojson,
      locations: comuni,
      z: valori,
      featureidkey: this.featureIdKey || 'properties.name',
      text: hoverTexts,
      hoverinfo: 'text',
      colorscale: 'Viridis',
      marker: { line: { width: 0.5, color: 'white' } },
      colorbar: {
        title: {
          text: this.wrapLabel(this.kpiAlias[this.selectedKpi!] || this.selectedKpi, 15),
          font: { size: 14 }      
        },
        thickness: 15,             
        len: 0.6,                  
        y: 0.5,                    
        yanchor: 'middle',          
        x: 1.01,                   
        outlinewidth: 0.5,
        tickfont: { size: 12 },
        tickvals: this.kpiTicks?.[0],
        ticktext: this.kpiTicks?.[1]      }  };

    const layout: Partial<Plotly.Layout> = {
      mapbox: {
        style: 'carto-positron',
        zoom: 8,
        center: { lon: 11.12, lat: 46.07 }
      },
      margin: { t: 0, b: 0, l: 0, r: 0 },
      showlegend: true
    };

    Plotly.react(this.mapEl.nativeElement, [trace], layout, { responsive: true });
  }
}
