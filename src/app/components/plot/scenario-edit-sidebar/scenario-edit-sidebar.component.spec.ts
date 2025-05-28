import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioEditSidebarComponent } from './scenario-edit-sidebar.component';

describe('ScenarioEditSidebarComponent', () => {
  let component: ScenarioEditSidebarComponent;
  let fixture: ComponentFixture<ScenarioEditSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScenarioEditSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenarioEditSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
