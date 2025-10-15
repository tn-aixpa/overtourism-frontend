import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalListPageComponent } from './proposal-list-page.component';

describe('ProposalListPageComponent', () => {
  let component: ProposalListPageComponent;
  let fixture: ComponentFixture<ProposalListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
