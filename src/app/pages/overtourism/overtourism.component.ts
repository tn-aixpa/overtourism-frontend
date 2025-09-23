import { Component, OnInit } from '@angular/core';
import { OvertourismService } from '../../services/overtourism.service';
import { SelectControlOption } from 'design-angular-kit';

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

  kpis: SelectControlOption<string>[] = [
    { value: 'popolazione', text: 'Popolazione' },
    { value: 'posti_letto', text: 'Posti Letto' },
    { value: 'ricettivita', text: 'Ricettività' }
  ];

  constructor(private svc: OvertourismService) {}
  getKpiName(arg0: string|null) {
    return this.kpis.find(k => k.value === arg0)?.text;}
  ngOnInit() {
    this.svc.getMap().subscribe(res => this.geojson = res);
    this.svc.getData().subscribe((res: any) => this.rawData = res.data);
  }

  selectKpi(val: string) {
    this.selectedKpi = val;
  }
}

