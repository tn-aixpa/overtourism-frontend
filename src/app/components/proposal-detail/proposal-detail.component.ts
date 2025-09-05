import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Proposal } from '../../models/proposal.model';

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail.component.html',
  standalone: false,
  styleUrls: ['./proposal-detail.component.scss'],
})
export class ProposalDetailComponent {
  @Input() proposal!: Proposal;
  @Output() deleteProposal = new EventEmitter<string>();
  @Output() editProposal = new EventEmitter<string>();

  // status potrebbe essere undefined, fallback a ''
  statusClass(status?: string): string {
    switch (status) {
      case 'draft': return 'bg-secondary text-white';
      case 'submitted': return 'bg-primary text-white';
      case 'approved': return 'bg-success text-white';
      case 'rejected': return 'bg-danger text-white';
      default: return 'bg-light text-dark';
    }
  }
}
