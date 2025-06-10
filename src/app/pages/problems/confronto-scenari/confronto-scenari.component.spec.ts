import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfrontoScenariComponent } from './confronto-scenari.component';

describe('ConfrontoScenariComponent', () => {
  let component: ConfrontoScenariComponent;
  let fixture: ComponentFixture<ConfrontoScenariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfrontoScenariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfrontoScenariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
