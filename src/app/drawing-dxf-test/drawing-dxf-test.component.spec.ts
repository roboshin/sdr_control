import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingDxfTestComponent } from './drawing-dxf-test.component';

describe('DrawingDxfTestComponent', () => {
  let component: DrawingDxfTestComponent;
  let fixture: ComponentFixture<DrawingDxfTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingDxfTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingDxfTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
