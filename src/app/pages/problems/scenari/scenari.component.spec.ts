import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariComponent } from './scenari.component';

describe('ScenariComponent', () => {
  let component: ScenariComponent;
  let fixture: ComponentFixture<ScenariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScenariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
