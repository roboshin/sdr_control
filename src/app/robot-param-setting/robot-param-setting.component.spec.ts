import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotParamSettingComponent } from './robot-param-setting.component';

describe('RobotParamSettingComponent', () => {
  let component: RobotParamSettingComponent;
  let fixture: ComponentFixture<RobotParamSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotParamSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotParamSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
