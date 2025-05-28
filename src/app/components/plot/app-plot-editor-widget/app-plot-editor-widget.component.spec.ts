import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPlotEditorWidgetComponent } from './app-plot-editor-widget.component';

describe('AppPlotEditorWidgetComponent', () => {
  let component: AppPlotEditorWidgetComponent;
  let fixture: ComponentFixture<AppPlotEditorWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppPlotEditorWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPlotEditorWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
