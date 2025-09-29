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

  kpis: { key: string; title: string; dataset: string; other: string[]; map: string }[] = [];

  constructor(private svc: OvertourismService) {}

  ngOnInit() {
    this.svc.getMap().subscribe(res => this.geojson = res);

    this.svc.getIndexes().subscribe((res: any) => {
      this.kpis = Object.values(res);
      if(this.kpis.length) {
        this.selectKpi(this.kpis[0].key); // preseleziona primo KPI
      }
    });
  }

  getKpiName(key: string | null): string | undefined {
    return this.kpis.find(k => k.key === key)?.title;
  }

  selectKpi(key: string) {
    this.selectedKpi = key;
    const indexInfo = this.kpis.find(k => k.key === key);
    if(!indexInfo) return;

    this.svc.getDataByDataset(indexInfo.dataset).subscribe((res: any) => {
      this.rawData = res.data;
    });
  }
}


