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

  selectedKpi: string = 'ricettivita';

  kpis: SelectControlOption<string>[] = [
    { value: 'ricettivita', text: 'Ricettività' },
    { value: 'turisticita', text: 'Turisticità' },
    { value: 'turisticita_estiva', text: 'Turisticità Estiva' },
    { value: 'non_convenzionali', text: 'Non Convenzionali' }
  ];

  constructor(private svc: OvertourismService) {}

  getKpiName(arg0: string | null) {
    return this.kpis.find(k => k.value === arg0)?.text;
  }

  ngOnInit() {
    this.svc.getMap().subscribe(res => (this.geojson = res));
    this.svc.getData().subscribe((res: any) => (this.rawData = res.data));
  }

  selectKpi(val: string) {
    this.selectedKpi = val;
  }
}
