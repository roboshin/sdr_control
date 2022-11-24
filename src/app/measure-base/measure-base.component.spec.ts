import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureBaseComponent } from './measure-base.component';

describe('MeasureBaseComponent', () => {
  let component: MeasureBaseComponent;
  let fixture: ComponentFixture<MeasureBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasureBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasureBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
