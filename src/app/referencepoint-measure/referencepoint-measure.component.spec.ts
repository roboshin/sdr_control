import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencepointMeasureComponent } from './referencepoint-measure.component';

describe('ReferencepointMeasureComponent', () => {
  let component: ReferencepointMeasureComponent;
  let fixture: ComponentFixture<ReferencepointMeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferencepointMeasureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferencepointMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
