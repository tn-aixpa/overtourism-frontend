import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertourismChartsComponent } from './overtourism-charts.component';

describe('OvertourismChartsComponent', () => {
  let component: OvertourismChartsComponent;
  let fixture: ComponentFixture<OvertourismChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OvertourismChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertourismChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
