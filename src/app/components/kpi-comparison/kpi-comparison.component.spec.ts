import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiComparisonComponent } from './kpi-comparison.component';

describe('KpiComparisonComponent', () => {
  let component: KpiComparisonComponent;
  let fixture: ComponentFixture<KpiComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpiComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
