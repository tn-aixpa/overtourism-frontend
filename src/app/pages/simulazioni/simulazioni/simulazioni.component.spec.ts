import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulazioniComponent } from './simulazioni.component';

describe('SimulazioniComponent', () => {
  let component: SimulazioniComponent;
  let fixture: ComponentFixture<SimulazioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimulazioniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
