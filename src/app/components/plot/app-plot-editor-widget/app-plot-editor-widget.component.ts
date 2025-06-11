import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScenarioService, Widget } from '../../../services/scenario.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-plot-editor-widget',
  standalone: false,
  templateUrl: './app-plot-editor-widget.component.html',
  styleUrls: ['./app-plot-editor-widget.component.scss']
})
export class AppPlotEditorWidgetComponent {
  @Input() widgets: Record<string, Widget[]> = {};
  objectKeys = Object.keys;

  scenario: any;
  rangeValue = 50;
  formGroup: FormGroup;
  constructor(private readonly formBuilder: FormBuilder,private scenarioService: ScenarioService) {
    this.formGroup = this.formBuilder.group({
      range: [null],
    });
  }
  // constructor(private scenarioService: ScenarioService) {}
  activeTab: string = '';

  ngOnInit(): void {
    this.scenarioService.currentScenario$.subscribe(scenario => {
      if (scenario) {
        this.scenario = scenario;
      }
    });
  // Inizializza vMin e vMax per i widget che hanno scala
  for (const group of this.objectKeys(this.widgets)) {
    for (const widget of this.widgets[group]) {
      if (widget.scale && widget.index_category !== '%') {
        widget.vMin = widget.loc ;
        widget.vMax = widget.loc+widget.scale;
      }
    }
  }
    this.scenarioService.fetchScenarioData();
  
    // Imposta il primo tab attivo se ce n'è almeno uno
    const groups = this.objectKeys(this.widgets);
    if (groups.length) {
      this.activeTab = groups[0];
    }
  }
  
  increase(widget: Widget): void {
    const step = widget.step || 1;
    const max = widget.max ?? Infinity;
    widget.v = Math.min(Number(widget.v ?? 0) + step, max);
  }
  
  decrease(widget: Widget): void {
    const step = widget.step || 1;
    const min = widget.min ?? -Infinity;
    widget.v = Math.max(Number(widget.v ?? 0) - step, min);
  }
}
