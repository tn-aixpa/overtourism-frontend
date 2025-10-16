import { Component, OnInit } from '@angular/core';
import { OvertourismService } from '../../../services/overtourism.service';

export interface KpiInfo {
  id: string; 
  key: string; 
  title: string;
  dataset: string;
  other: string[];
  alias: Record<string, string>;
  map: any;
  help?: string;
}

@Component({
  selector: 'app-capacity',
  templateUrl: './capacity.component.html',
  styleUrls: ['./capacity.component.scss'],
  standalone: false,
})
export class CapacityComponent implements OnInit {
  geojson: any;
  rawData: any[] = [];
  selectedKpiId: string | null = null; 
  kpis: KpiInfo[] = [];

  featureIdKey: string | null = null;
  locationsCol: string | null = null;
  activeTab: string = 'mappa';
  selectedHelp: string | null = null;
  selectedKpiAlias: Record<string, string> = {};
  selectedKpiKey: string | null = null; 

  hoverTemplateBuilder?: (record: any, alias?: Record<string, string>) => string;

  constructor(private svc: OvertourismService) {}

  ngOnInit() {
    this.svc.getIndexesByCategory('capacity').subscribe((res: any) => {
      this.kpis = Object.entries(res).map(([id, data]: [string, any]) => ({
        ...data,
        id, 
      }));

      if (this.kpis.length) {
        const firstKpi = this.kpis[0];
        this.featureIdKey = firstKpi.map.key;
        this.locationsCol = firstKpi.map.locations_col;
        this.selectKpi(firstKpi.id);
      }
    });
  }

  getKpiName(id: string | null): string | undefined {
    return this.kpis.find(k => k.id === id)?.title;
  }

  selectKpi(id: string) {
    const indexInfo = this.kpis.find(k => k.id === id);
    if (indexInfo) {
      const fields = ['anno', 'comune', ...(indexInfo.other || [])];
      const alias = indexInfo.alias || {};

      this.hoverTemplateBuilder = (d: any): string => {
        if (!d) return '';
        return fields
          .map(f => `<b>${alias[f] || f}:</b> ${d[f] ?? '-'}<br>`)
          .join('');
      };
      this.selectedKpiAlias = alias;
    } else {
      this.selectedKpiAlias = {};
    }

    this.selectedKpiId = indexInfo ? indexInfo.id : null;
    this.selectedKpiKey = indexInfo ? indexInfo.key : null; 
    this.selectedHelp = indexInfo?.help || null;
    if (!indexInfo) return;

    // Dati KPI
    this.svc.getDataByDataset(indexInfo.dataset).subscribe((res: any) => {
      this.rawData = res.data;
    });

    // GeoJSON relativo
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