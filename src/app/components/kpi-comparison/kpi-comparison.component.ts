import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-comparison',
  templateUrl: './kpi-comparison.component.html',
  styleUrls: ['./kpi-comparison.component.scss'],
  standalone: false
})
export class KpiComparisonComponent {
  @Input() kpisLeft!: Record<string, number>;
  @Input() kpisRight!: Record<string, number>;

  get kpiKeys(): string[] {
    const excluded = ['uncertainty', 'uncertainty_by_constraint', 'critical_constraint'];
    return Object.keys(this.kpisLeft || {}).filter(key => !excluded.includes(key));  }

  formatNumber(v: number): string {
    if (typeof v !== 'number' || isNaN(v)) return '-';
    const scaled = v ;
    if (scaled < 1 && scaled > 0) return '<1%';
    return `${Math.round(scaled)}%`;
  }


  getDeltaPerc(left?: number, right?: number): string {
    if (left === undefined || left === 0 || right === undefined) return '—';
    const delta = right - left;
    const percent = Math.round(delta);
  
    if (delta < 1 && delta > 0) return '<1%';
    if (percent > 0) return `+${percent}%`;
    return `${percent}%`;
  }  
  getDeltaClass(left: number, right: number): string {
    const deltaPerc = (right - left);
  
    if (Math.abs(deltaPerc) <= 2) return 'btn-outline-secondary'; // Grigio
    if (deltaPerc > 2) return 'btn-outline-danger';              // Rosso
    return 'btn-outline-success';                                // Verde
  }
}
