import { Component, OnInit } from '@angular/core';
import { OvertourismService } from '../../services/overtourism.service';

@Component({
  selector: 'app-overtourism',
  templateUrl: './overtourism.component.html',
  standalone: false,
  styleUrls: ['./overtourism.component.scss'],
})
export class OvertourismComponent implements OnInit {
  geojson: any;
  rawData: any[] = [];
  selectedKpi: string | null = null; 
  kpis: { key: string; title: string; dataset: string; other: string[]; map: any }[] = [];
  featureIdKey: string | null = null;
  locationsCol: string | null = null;
  activeTab: string = 'mappa';

  onTabSelected(event: any) {
    console.log('Tab selezionato:', event);
    if (event.label === 'Mappa') {
      this.activeTab = 'mappa';
    } else if (event.label === 'Grafici') {
      this.activeTab = 'grafici';
    }
  }  constructor(private svc: OvertourismService) {}

  ngOnInit() {
    this.svc.getIndexes().subscribe((res: any) => {
      this.kpis = Object.values(res);
      if (this.kpis.length) {
        const firstKpi = this.kpis[0];
        this.featureIdKey = firstKpi.key;
        this.selectKpi(firstKpi.key); // preseleziona primo KPI e carica dati + mappa
      }
    });
  }

  getKpiName(key: string | null): string | undefined {
    return this.kpis.find(k => k.key === key)?.title;
  }

  selectKpi(key: string) {
    this.selectedKpi = key;

    const indexInfo = this.kpis.find(k => k.key === key);
    this.selectedKpi = indexInfo ? indexInfo.key : null;
    if (!indexInfo) return;
  
    // dati KPI
    this.svc.getDataByDataset(indexInfo.dataset).subscribe((res: any) => {
      this.rawData = res.data;
    });
  
    // geojson relativo a quel dataset
    this.svc.getMapByDataset(indexInfo.map.geojson).subscribe(res => {
      this.geojson = res;
      this.featureIdKey = indexInfo.map.key;         // es. "properties.com_code"
      this.locationsCol = indexInfo.map.locations_col;
    });
  }
  selectKpiByIndex(i: number) {
    const indexInfo = this.kpis[i];
    if (!indexInfo) return;
  
    this.selectedKpi = indexInfo.key;
  
    // dati KPI
    this.svc.getDataByDataset(indexInfo.dataset).subscribe((res: any) => {
      this.rawData = res.data;
    });
  
    // geojson relativo a quel dataset
    this.svc.getMapByDataset(indexInfo.map.geojson).subscribe(res => {
      this.geojson = res;
      this.featureIdKey = indexInfo.map.key;         // es. "properties.com_code"
      this.locationsCol = indexInfo.map.locations_col; // es. "ID"
    });
  }
}


