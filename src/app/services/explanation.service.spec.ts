import { TestBed } from '@angular/core/testing';

import { ExplanationService } from './explanation.service';

describe('ExplanationService', () => {
  let service: ExplanationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExplanationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
