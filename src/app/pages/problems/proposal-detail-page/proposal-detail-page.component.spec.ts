import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalDetailPageComponent } from './proposal-detail-page.component';

describe('ProposalDetailPageComponent', () => {
  let component: ProposalDetailPageComponent;
  let fixture: ComponentFixture<ProposalDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
