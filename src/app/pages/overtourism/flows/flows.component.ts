import { Component, OnInit } from '@angular/core';
import { OvertourismService } from '../../../services/overtourism.service';


export interface KpiInfo {
  key: string;
  title: string;
  dataset: string;
  other: string[];
  alias: Record<string, string>;
  map: {
    geojson: string;
    key: string;
    locations_col: string;
  };
  help?: string;
  ticks?: any;
  _id?: string; // chiave originale del record
}
@Component({
  selector: 'app-flows',
  templateUrl: './flows.component.html',
  styleUrls: ['./flows.component.scss'],
  standalone: false,
})
export class FlowsComponent implements OnInit {
  geojson: any;
  rawData: any[] = [];
  selectedKpi: string | null = null;
  kpis: KpiInfo[] = [];
  featureIdKey: string | null = null;
  locationsCol: string | null = null;
  activeTab: string = 'mappa';
  selectedHelp: string | null = null;

  // Filtri
  indicatore = 'tutti';
  direzione = 'in';
  giorni = 'feriali';
Object: any;
hoverTemplateBuilder?: (record: any, alias?: Record<string, string>) => string;
selectedKpiAlias: Record<string, string> = {};

  constructor(private svc: OvertourismService) {}

  ngOnInit() {
    this.svc.getIndexesByCategory('flows').subscribe((res: any) => {
      this.kpis = Object.entries(res).map(([key, value]) => ({
        ...(value as object),
        _id: key,
      })) as KpiInfo[];
           this.applyFilters();
    });
  }

  applyFilters() {
    const key = `flusso_${this.direzione}_${this.indicatore}_${this.giorni}`;
    console.log('Filtri aggiornati:', { key });

    // ✅ cerca usando la chiave originale salvata come _id
    const indexInfo = this.kpis.find(kpi => kpi._id === key);
    if (indexInfo) {
      const fields = ['anno', 'comune', ...(indexInfo.other || [])];
      const alias = indexInfo.alias || {};
    
      this.hoverTemplateBuilder = (d: any) => {
        return fields
          .map(f => `<b>${alias[f] || f}:</b> ${d[f] ?? '-'}<br>`)
          .join('');
      };
      this.selectedKpiAlias = alias; 
    } else {
      this.selectedKpiAlias = {};
      }
    if (!indexInfo) {
      console.warn(`Nessun KPI trovato per ${key}`);
      return;
    }

    this.selectedKpi = indexInfo.key;
    this.selectedHelp = indexInfo.help ?? null;

    // ✅ carica dati KPI
    this.svc.getDataByDataset(indexInfo.dataset).subscribe((res: any) => {
      this.rawData = res.data;
    });

    // ✅ carica geojson relativo
    this.svc.getMapByDataset(indexInfo.map.geojson).subscribe(res => {
      this.geojson = res;
      this.featureIdKey = indexInfo.map.key;
      this.locationsCol = indexInfo.map.locations_col;
    });
  }

  onTabSelected(event: any) {
    this.activeTab = event.label === 'Mappa' ? 'mappa' : 'grafici';
  }
}
