import { TestBed } from '@angular/core/testing';

import { MarketMonitorService } from './market-monitor.service';

describe('IncomeMonitorService', () => {
  let service: MarketMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketMonitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
