import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IgxCategoryChartModule } from 'igniteui-angular-charts';
import { CategoryChartComponent } from './category-chart.component';

describe('CategoryChartComponent', () => {
  let component: CategoryChartComponent;
  let fixture: ComponentFixture<CategoryChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryChartComponent],
      imports: [FormsModule, IgxCategoryChartModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
