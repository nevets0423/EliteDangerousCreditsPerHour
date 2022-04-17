import { TestBed } from '@angular/core/testing';

import { JournalNotifierService } from './journal-notifier.service';

describe('JournalNotifierService', () => {
  let service: JournalNotifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalNotifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
