import { Component, OnInit } from '@angular/core';
import { OvertourismService } from '../../../services/overtourism.service';

@Component({
  selector: 'app-capacity',
  templateUrl: './capacity.component.html',
  styleUrls: ['./capacity.component.scss'],
  standalone: false,
})
export class CapacityComponent implements OnInit {
  geojson: any;
  rawData: any[] = [];
  selectedKpi: string | null = null;
  kpis: {
    key: string;
    title: string;
    dataset: string;
    other: string[];
    alias: Record<string, string>;
    map: any;
    help?: string;
  }[] = [];  
  featureIdKey: string | null = null;
  locationsCol: string | null = null;
  activeTab: string = 'mappa';
  selectedHelp: string | null = null;   // help del KPI selezionato
  hoverTemplateBuilder: ((d: any) => string) | null = null;

  constructor(private svc: OvertourismService) {}

  ngOnInit() {
    this.svc.getIndexesByCategory('capacity').subscribe((res: any) => {
      this.kpis = Object.values(res);
      if (this.kpis.length) {
        const firstKpi = this.kpis[0];
        this.featureIdKey = firstKpi.map.key;
        this.locationsCol = firstKpi.map.locations_col;
        this.selectKpi(firstKpi.key); 
      }
    });
  }

  getKpiName(key: string | null): string | undefined {
    return this.kpis.find(k => k.key === key)?.title;
  }

  selectKpi(key: string) {
    const indexInfo = this.kpis.find(k => k.key === key);
    if (indexInfo) {
      const fields = ['anno', 'comune', ...(indexInfo.other || [])];
      const alias = indexInfo.alias || {};
    
      this.hoverTemplateBuilder = (d: any) => {
        return fields
          .map(f => `<b>${alias[f] || f}:</b> ${d[f] ?? '-'}<br>`)
          .join('');
      };
    }
    this.selectedKpi = indexInfo ? indexInfo.key : null;
    this.selectedHelp = indexInfo?.help || null;   // salva help
    if (!indexInfo) return;

    // dati KPI
    this.svc.getDataByDataset(indexInfo.dataset).subscribe((res: any) => {
      this.rawData = res.data;
    });

    // geojson relativo
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
