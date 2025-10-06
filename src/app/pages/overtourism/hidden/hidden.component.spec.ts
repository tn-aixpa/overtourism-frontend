import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenComponent } from './hidden.component';

describe('HiddenComponent', () => {
  let component: HiddenComponent;
  let fixture: ComponentFixture<HiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiddenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
