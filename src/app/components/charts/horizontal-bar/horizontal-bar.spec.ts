import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorizontalBar } from './horizontal-bar';
import { SimpleChange } from '@angular/core';

describe('HorizontalBar', () => {
  let component: HorizontalBar;
  let fixture: ComponentFixture<HorizontalBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalBar]
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalBar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update chart when data changes', () => {
    const mockData = [
      { name: 'Food', value: 200 },
      { name: 'Transport', value: 100 }
    ];

    component.categoryData = mockData;
    component.ngOnChanges({
      categoryData: new SimpleChange([], mockData, true)
    });

    expect(component.chartOptions).toBeTruthy();
    expect(component.updateFlag).toBe(true);
  });

  it('should handle empty data', () => {
    component.categoryData = [];
    component.ngOnChanges({
      categoryData: new SimpleChange([], [], true)
    });
    expect(component.chartOptions).toBeTruthy();
    expect(component.updateFlag).toBe(true);
  });

  it('should map category values correctly to series data', () => {
    const mockData = [
      { name: 'Food', value: 200 },
      { name: 'Transport', value: 100 }
    ];
    component.categoryData = mockData;
    component.ngOnChanges({
      categoryData: new SimpleChange([], mockData, true)
    });
    const series = component.chartOptions.series as any[];
    expect(series[0].data).toEqual([200, 100]);
  });

  it('should not create chart if categoryData is not present', () => {
    component.chartOptions = {};
    component.updateFlag = false;

    component.ngOnChanges({});

    expect(component.updateFlag).toBe(false);
  });
});
