import { TestBed, inject } from '@angular/core/testing';

import { DomUtilitiesService } from './dom-utilities.service';

describe('DomUtilitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomUtilitiesService]
    });
  });

  it('should be created', inject([DomUtilitiesService], (service: DomUtilitiesService) => {
    expect(service).toBeTruthy();
  }));
});
