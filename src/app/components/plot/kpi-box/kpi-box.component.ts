import { Component, Input } from '@angular/core';
import { KPIs } from '../../../models/plot.model';
@Component({
  selector: 'app-kpi-box',
  standalone: false,
  templateUrl: './kpi-box.component.html',
  styleUrl: './kpi-box.component.scss'
})
export class KpiBoxComponent {
  @Input() kpisData?: KPIs;
  @Input() formatNumber: (value: number) => string = (v) => v.toString();

  kpiKeys: string[] = [];
  kpiLabels: { [key: string]: string } = {};
  
  ngOnChanges() {
    if (this.kpisData) {
      this.kpiKeys = Object.keys(this.kpisData)
        .filter(key => key !== 'critical constraint');
      this.kpiLabels = {};
      this.kpiKeys.forEach(key => {
        this.kpiLabels[key] = 'kpi.' + key.replace(/ /g, '_');
      });
    }
  }
  getKpiValue(key: string): number {
    const value = this.kpisData?.[key];
    return typeof value === 'number' ? value : 0;
  }
  getKpiRawValue(key: string): number | { level: number } | undefined {
    return this.kpisData?.[key];
  }
  get criticalConstraint() {
    const value = this.kpisData?.['critical constraint'];
    if (
      value &&
      typeof value === 'object' &&
      'name' in value &&
      'level' in value
    ) {
      return value as { name: string; level: number };
    }
    return null;
  }
  getKpiClass(value: number | { level: number } | undefined): string {
    const level = typeof value === 'number' 
      ? value 
      : typeof value === 'object' && value !== null && 'level' in value 
        ? value.level 
        : 0;
  
    if (level < 10) return 'kpi-box green';
    if (level < 30) return 'kpi-box yellow';
    return 'kpi-box red';
  }
}
