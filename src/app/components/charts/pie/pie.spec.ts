import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { Pie } from './pie';

describe('Pie', () => {
  let component: Pie;
  let fixture: ComponentFixture<Pie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pie]
    }).compileComponents();

    fixture = TestBed.createComponent(Pie);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build chart when inputs change', () => {
    component.mode = 'savings';
    component.primaryValue = 100;
    component.remainingValue = 50;

    component.ngOnChanges({
      primaryValue: new SimpleChange(0, 100, true)
    });

    expect(component.chartOptions.series).toBeTruthy();
    expect(component.updateFlag).toBe(true);
  });

  it('should build correct data for savings mode', () => {
    component.mode = 'savings';
    component.primaryValue = 100;
    component.remainingValue = 50;

    component.ngOnChanges({
      mode: new SimpleChange('spent', 'savings', true)
    });

    const series = component.chartOptions.series as any[];
    expect(series[0].data).toEqual([
      { name: 'Saved', y: 100, color: '#43a047' },
      { name: 'Remaining', y: 50, color: '#e53935' }
    ]);
  });

  it('should build correct data for spending mode', () => {
    component.mode = 'spent';
    component.primaryValue = 100;
    component.remainingValue = 50;

    component.ngOnChanges({
      mode: new SimpleChange('savings', 'spent', true)
    });

    const series = component.chartOptions.series as any[];
    expect(series[0].data).toEqual([
      { name: 'Spent', y: 100, color: '#e53935' },
      { name: 'Remaining', y: 50, color: '#43a047' }
    ]);
  });
});
