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
  @Input() featureIdKey: string | null = null;
  @Input() locationsCol: string | null = null;
  @Input() active: boolean = true;

  @Input() hoverTemplateBuilder: ((d: any) => string) | null = null;

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
      marker: { line: { width: 0.5, color: 'white' } }
    };

    const layout: Partial<Plotly.Layout> = {
      mapbox: {
        style: 'carto-positron',
        zoom: 8,
        center: { lon: 11.12, lat: 46.07 }
      },
      margin: { t: 0, b: 0, l: 0, r: 0 },
    };

    Plotly.react(this.mapEl.nativeElement, [trace], layout, { responsive: true });
  }
}
