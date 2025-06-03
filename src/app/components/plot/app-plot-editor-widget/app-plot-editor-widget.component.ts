import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScenarioService } from '../../../services/scenario.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-plot-editor-widget',
  standalone: false,
  templateUrl: './app-plot-editor-widget.component.html',
  styleUrls: ['./app-plot-editor-widget.component.scss']
})
export class AppPlotEditorWidgetComponent {
  @Input() editorData: any;
  scenario: any;
  rangeValue = 50;
  formGroup: FormGroup;
  constructor(private readonly formBuilder: FormBuilder,private scenarioService: ScenarioService) {
    this.formGroup = this.formBuilder.group({
      range: [null],
    });
  }
  // constructor(private scenarioService: ScenarioService) {}
  ngOnInit(): void {
    this.scenarioService.currentScenario$.subscribe(scenario => {
      if (scenario) {
        this.scenario = scenario;
      }
    });
  
    this.scenarioService.fetchScenarioData(); // trigger iniziale
  }
  
}
