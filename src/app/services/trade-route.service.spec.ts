import { TestBed } from '@angular/core/testing';

import { TradeRouteService } from './trade-route.service';

describe('TradeRouteService', () => {
  let service: TradeRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
