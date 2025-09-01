import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProposalCreateComponent } from './app-proposal-create.component';

describe('AppProposalCreateComponent', () => {
  let component: AppProposalCreateComponent;
  let fixture: ComponentFixture<AppProposalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppProposalCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppProposalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
