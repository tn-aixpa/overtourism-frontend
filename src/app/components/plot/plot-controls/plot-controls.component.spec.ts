import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotControlsComponent } from './plot-controls.component';

describe('PlotControlsComponent', () => {
  let component: PlotControlsComponent;
  let fixture: ComponentFixture<PlotControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlotControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlotControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
