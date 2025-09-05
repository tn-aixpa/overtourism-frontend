import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalCreateComponent } from './app-proposal-create.component';

describe('AppProposalCreateComponent', () => {
  let component: ProposalCreateComponent;
  let fixture: ComponentFixture<ProposalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
