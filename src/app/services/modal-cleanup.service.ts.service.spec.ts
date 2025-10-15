import { TestBed } from '@angular/core/testing';

import { ModalCleanupServiceTsService } from './modal-cleanup.service.ts.service';

describe('ModalCleanupServiceTsService', () => {
  let service: ModalCleanupServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalCleanupServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
