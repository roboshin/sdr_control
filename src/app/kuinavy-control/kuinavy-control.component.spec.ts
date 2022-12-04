import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KuinavyControlComponent } from './kuinavy-control.component';

describe('KuinavyControlComponent', () => {
  let component: KuinavyControlComponent;
  let fixture: ComponentFixture<KuinavyControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KuinavyControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KuinavyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
