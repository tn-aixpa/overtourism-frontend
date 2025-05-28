import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-scenario-edit-sidebar',
  standalone: false,
  templateUrl: './scenario-edit-sidebar.component.html',
  styleUrl: './scenario-edit-sidebar.component.scss'
})
export class ScenarioEditSidebarComponent {
  @Input() scenario: any;
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  editedScenario: any = {};

  ngOnChanges() {
    this.editedScenario = { ...this.scenario };
  }

  onSave() {
    this.save.emit(this.editedScenario);
  }
}
