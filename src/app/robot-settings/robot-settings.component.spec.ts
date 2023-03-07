import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotSettingsComponent } from './robot-settings.component';

describe('RobotSettingsComponent', () => {
  let component: RobotSettingsComponent;
  let fixture: ComponentFixture<RobotSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
