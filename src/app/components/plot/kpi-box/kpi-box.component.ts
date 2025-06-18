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
  formatNumber(v: number): string {
    if (typeof v !== 'number' || isNaN(v)) return '-';
    const scaled = v ;
    if (scaled < 1 && scaled > 0) return '<1%';
    return `${Math.round(scaled)}%`;
  }
  getKpiValue(key: string): number {
    const value = this.kpisData?.[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && value !== null && 'level' in value) return value.level;
    return 0;
  }
  
  kpiKeys: string[] = [];
  kpiLabels: { [key: string]: string } = {};
  criticalConstraintKey: string | null = null;

  ngOnChanges() {
    if (this.kpisData) {
      this.kpiKeys = Object.keys(this.kpisData)
        .filter(key => key !== 'critical constraint');
      this.kpiLabels = {};
      this.kpiKeys.forEach(key => {
        this.kpiLabels[key] = 'kpi.' + key.replace(/ /g, '_');
      });
    }
    const cc = this.kpisData?.['critical_constraint'];
let dynamicKey: string | null = null;
if (
  cc &&
  typeof cc === 'object' &&
  'name' in cc &&
  'level' in cc
) {
  dynamicKey = `constraint_level_${cc.name}`;
  this.criticalConstraintKey = dynamicKey;
} else {
  this.criticalConstraintKey = null;
}

let keys = this.kpiKeys.filter(k => k !== dynamicKey && k !== 'overtourism_level');

this.kpiKeys = [];

if (this.kpisData && 'overtourism_level' in this.kpisData) {
  this.kpiKeys.push('overtourism_level');
}

if (dynamicKey) {
  this.kpiKeys.push(dynamicKey);
}

this.kpiKeys.push(...keys);

  }
  
  // getKpiValue(key: string): number {
  //   const value = this.kpisData?.[key];
  //   return typeof value === 'number' ? value : 0;
  // }
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
