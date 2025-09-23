import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertourismMapComponent } from './overtourism-map.component';

describe('OvertourismMapComponent', () => {
  let component: OvertourismMapComponent;
  let fixture: ComponentFixture<OvertourismMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OvertourismMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertourismMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
