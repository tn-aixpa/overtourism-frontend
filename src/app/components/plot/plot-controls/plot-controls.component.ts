import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-plot-controls',
  standalone: false,
  templateUrl: './plot-controls.component.html',
  styleUrls: ['./plot-controls.component.scss']
})
export class PlotControlsComponent {
  // @Input() showAllSubsystems!: boolean;
  @Input() monoDimensionale!: boolean;
  // @Input() heatmapAttiva!: boolean;
  @Input() sottosistemi!: Array<{ value: string; label: string }>;
  @Input() sottosistemaSelezionato!: string;

  // @Output() showAllSubsystemsChange = new EventEmitter<boolean>();
  @Output() monoDimensionaleChange = new EventEmitter<boolean>();
  // @Output() heatmapAttivaChange = new EventEmitter<boolean>();
  @Output() sottosistemaSelezionatoChange = new EventEmitter<string>();
  @Output() funzioneChange = new EventEmitter<void>();
  @Output() heatmapToggle = new EventEmitter<void>();
  setMonoDimensionale(val: boolean) {
    this.monoDimensionale = val;
    this.monoDimensionaleChange.emit(val);
    this.funzioneChange.emit();
  }
  readonly colorScaleLegend = [
    { value: 0.00, color: 'rgb(5, 102, 8)' },
    { value: 0.05, color: 'rgb(100, 180, 90)' },
    { value: 0.20, color: 'rgb(180, 230, 170)' },
    { value: 0.40, color: 'rgb(230, 250, 225)' },
    { value: 0.50, color: 'yellow' },
    { value: 0.60, color: 'rgb(255, 242, 242)' },
    { value: 0.80, color: 'rgb(242, 204, 204)' },
    { value: 0.95, color: 'rgb(204, 76, 76)' },
    { value: 1.00, color: 'rgb(180, 4, 38)' },
  ];
}