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
  @Input() data: any[] = [];              // dati dei comuni con KPI e anno
  @Input() geojson: any = null;           // geometrie
  @Input() selectedKpi: string | null = null;

  @ViewChild('mapChart', { static: false }) mapEl!: ElementRef;

  selectedAnno: number | null = null;
  anniDisponibili: number[] = [];
  private initialized = false;

  ngAfterViewInit() {
    this.initialized = true;
    this.tryDrawMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Disegna solo se il componente è inizializzato e se ci sono dati e geojson
    if (!this.initialized) return;
  
    if ((changes['data'] && this.data?.length) || 
        (changes['geojson'] && this.geojson) || 
        changes['selectedKpi']) {
      this.setupAnni();
      this.tryDrawMap();
    }
  }
  private tryDrawMap() {
    // Non disegnare se manca qualcosa
    if (!this.data?.length || !this.geojson || !this.selectedKpi || this.selectedAnno === null) return;
    if (!this.mapEl?.nativeElement) return;
  
    this.drawMap();
  }
  private setupAnni() {
    if (this.data?.length) {
      this.anniDisponibili = Array.from(new Set(this.data.map(d => d.anno))).sort();
      if (!this.selectedAnno) {
        this.selectedAnno = this.anniDisponibili[this.anniDisponibili.length - 1]; // ultimo anno disponibile
      }
    }
  }

  drawMap() {
    // Se non c'è data, comune o KPI selezionato, non disegnare
    if (!this.data?.length || !this.geojson || !this.selectedKpi || this.selectedAnno === null) return;
    if (!this.mapEl?.nativeElement) return;
    const datiAnno = this.data.filter(d => d.anno === this.selectedAnno);

    const comuni: string[] = [];
    const valori: number[] = [];

    this.geojson.features.forEach((feature: any) => {
      const nomeComune = feature.properties?.name;
      const datoComune = datiAnno.find(d => d.comune === nomeComune);
      comuni.push(nomeComune);
      valori.push(datoComune ? datoComune[this.selectedKpi!] : NaN);
    });

    const trace: ChoroplethMapboxTrace = {
      type: 'choroplethmapbox',
      geojson: this.geojson,
      locations: comuni,
      z: valori,
      featureidkey: 'properties.name',
      colorscale: 'Viridis',
      marker: { line: { width: 0.5, color: 'white' } },
      hovertemplate: '<b>%{location}</b><br>' + `${this.selectedKpi}: %{z:.2f}<extra></extra>`
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
