import { TestBed, inject } from '@angular/core/testing';

import { AosEditOnlineService } from './aos.editonline.service';

describe('AosEditonlineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AosEditOnlineService]
    });
  });

  it('should be created', inject([AosEditOnlineService], (service: AosEditOnlineService) => {
    expect(service).toBeTruthy();
  }));
});
