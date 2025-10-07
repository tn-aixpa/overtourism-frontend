import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-comparison',
  templateUrl: './kpi-comparison.component.html',
  styleUrls: ['./kpi-comparison.component.scss'],
  standalone: false
})
export class KpiComparisonComponent {
  @Input() kpisLeft!: Record<string, { level: number; confidence: number }>;
  @Input() kpisRight!: Record<string, { level: number; confidence: number }>;

  get kpiKeys(): string[] {
    const excluded = ['uncertainty', 'uncertainty_by_constraint', 'critical_constraint'];
    return Object.keys(this.kpisLeft || {}).filter(key => !excluded.includes(key));  }

    formatNumber(v: { level: number } | undefined): string {
      if (!v || typeof v.level !== 'number' || isNaN(v.level)) return '-';
      const scaled = v.level;
      if (scaled < 1 && scaled > 0) return '<1%';
      return `${Math.round(scaled)}%`;
    }
    


    getDeltaPerc(left?: { level: number }, right?: { level: number }): string {
      if (!left || !right || left.level === right.level) return '—';
      const delta = right.level - left.level;
      const percent = Math.round(delta);
    
      if (delta < 1 && delta > 0) return '<1%';
      if (delta > -1 && delta < 0) return '<-1%';
      if (percent > 0) return `+${percent}%`;
      return `${percent}%`;
    }
    
    getDeltaClass(left: { level: number }, right: { level: number }): string {
      const deltaPerc = right?.level - left?.level;
    
      if (Math.abs(deltaPerc) <= 2) return 'btn-outline-secondary'; // Grigio
      if (deltaPerc > 2) return 'btn-outline-danger';               // Rosso
      return 'btn-outline-success';                                 // Verde
    }
    
}
