import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedistributionComponent } from './redistribution.component';

describe('RedistributionComponent', () => {
  let component: RedistributionComponent;
  let fixture: ComponentFixture<RedistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
