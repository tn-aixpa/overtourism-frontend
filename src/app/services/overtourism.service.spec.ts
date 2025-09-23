import { TestBed } from '@angular/core/testing';

import { OvertourismService } from './overtourism.service';

describe('OvertourismService', () => {
  let service: OvertourismService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvertourismService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
