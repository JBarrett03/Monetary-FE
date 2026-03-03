import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Line } from './line';
import { SimpleChange } from '@angular/core';

describe('Line', () => {
  let component: Line;
  let fixture: ComponentFixture<Line>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Line]
    }).compileComponents();

    fixture = TestBed.createComponent(Line);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create chart when inputs change', () => {
    component.mode = 'savings';
    component.primaryValue = 100;
    component.remainingValue = 50;

    component.ngOnChanges({
      primaryValue: new SimpleChange(0, 100, true),
      mode: new SimpleChange('spent', 'savings', true),
      remainingValue: new SimpleChange(0, 50, true)
    });

    expect(component.chartOptions).toBeTruthy();
    expect(component.updateFlag).toBe(true);
  });

  it('should set chart options correctly for savings mode', () => {
    component.mode = 'savings';
    component.primaryValue = 100;
    component.remainingValue = 50;

    component.ngOnChanges({
      mode: new SimpleChange('spent', 'savings', true),
      primaryValue: new SimpleChange(0, 100, true),
      remainingValue: new SimpleChange(0, 50, true)
    });

    const xAxis = Array.isArray(component.chartOptions.xAxis)
      ? component.chartOptions.xAxis[0]
      : component.chartOptions.xAxis;
    expect(xAxis?.categories).toEqual(['Saved', 'Remaining']);
  });

    it('should set chart options correctly for spending mode', () => {
    component.mode = 'spent';
    component.primaryValue = 100;
    component.remainingValue = 50;

    component.ngOnChanges({
      mode: new SimpleChange('savings', 'spent', true),
      primaryValue: new SimpleChange(0, 100, true),
      remainingValue: new SimpleChange(0, 50, true)
    });

    const xAxis = Array.isArray(component.chartOptions.xAxis)
      ? component.chartOptions.xAxis[0]
      : component.chartOptions.xAxis;
    expect(xAxis?.categories).toEqual(['Spent', 'Remaining']);
  });

  it('should set series data correctly', () => {
    component.mode = 'savings';
    component.primaryValue = 100;
    component.remainingValue = 50;

    component.ngOnChanges({
      primaryValue: new SimpleChange(0, 300, true)
    });

    const series = component.chartOptions.series as any[];
    expect(series[0].data).toEqual([100, 50]);
  });

  it('should not update chart if relevant inputs have not changed', () => {
    component.updateFlag = false;
    component.ngOnChanges({});
    expect(component.updateFlag).toBe(false);
  });
});