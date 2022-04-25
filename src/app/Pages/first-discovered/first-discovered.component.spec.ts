import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstDiscoveredComponent } from './first-discovered.component';

describe('FirstDiscoveredComponent', () => {
  let component: FirstDiscoveredComponent;
  let fixture: ComponentFixture<FirstDiscoveredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstDiscoveredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstDiscoveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
