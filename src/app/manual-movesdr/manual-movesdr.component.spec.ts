import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualMovesdrComponent } from './manual-movesdr.component';

describe('ManualMovesdrComponent', () => {
  let component: ManualMovesdrComponent;
  let fixture: ComponentFixture<ManualMovesdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualMovesdrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualMovesdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
