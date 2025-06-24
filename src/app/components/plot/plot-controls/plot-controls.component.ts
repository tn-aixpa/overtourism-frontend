import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-plot-controls',
  standalone: false,
  templateUrl: './plot-controls.component.html',
  styleUrls: ['./plot-controls.component.scss']
})
export class PlotControlsComponent {
  @Input() monoDimensionale!: boolean;
  @Input() sottosistemi!: Array<{ value: string; label: string }>;
  @Input() sottosistemaSelezionato!: string;
  @Output() monoDimensionaleChange = new EventEmitter<boolean>();
  @Output() sottosistemaSelezionatoChange = new EventEmitter<string>();
  @Output() funzioneChange = new EventEmitter<void>();
  setMonoDimensionale(val: boolean) {
    this.monoDimensionale = val;
    this.monoDimensionaleChange.emit(val);
    this.funzioneChange.emit();
  }
}