import { TestBed, inject } from '@angular/core/testing';

import { AmazonFirebaseSupportService } from './amazon-firebase-support.service';

describe('AmazonFirebaseSupportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmazonFirebaseSupportService]
    });
  });

  it('should be created', inject([AmazonFirebaseSupportService], (service: AmazonFirebaseSupportService) => {
    expect(service).toBeTruthy();
  }));
});
