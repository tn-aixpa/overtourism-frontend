import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertourismComponent } from './overtourism.component';

describe('OvertourismComponent', () => {
  let component: OvertourismComponent;
  let fixture: ComponentFixture<OvertourismComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OvertourismComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertourismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
