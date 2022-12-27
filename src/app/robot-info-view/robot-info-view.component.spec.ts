import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotInfoViewComponent } from './robot-info-view.component';

describe('RobotInfoViewComponent', () => {
  let component: RobotInfoViewComponent;
  let fixture: ComponentFixture<RobotInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotInfoViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
