import { TestBed } from '@angular/core/testing';

import { PrivateInfoService } from './private-info.service';

describe('PrivateInfoService', () => {
  let service: PrivateInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivateInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
