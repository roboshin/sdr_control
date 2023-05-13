import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibPrintPointComponent } from './calib-print-point.component';

describe('CalibPrintPointComponent', () => {
  let component: CalibPrintPointComponent;
  let fixture: ComponentFixture<CalibPrintPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalibPrintPointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalibPrintPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
