import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountService } from '../../services/account-service';
import { TransactionService } from '../../services/transaction-service';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Spending } from './spending';

describe('Spending', () => {
  let component: Spending;
  let fixture: ComponentFixture<Spending>;
  let accountService: any;
  let transactionService: any;

  beforeEach(async () => {
    accountService = {
      getAccounts: vi.fn(),
    };
    transactionService = {
      getTransactionSummary: vi.fn(),
      getAccountTransactionSummary: vi.fn(),
      getCategorySummary: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [Spending],
      providers: [
        { provide: AccountService, useValue: accountService },
        { provide: TransactionService, useValue: transactionService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Spending);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should activate savings view', () => {
    const spyLoad = vi.spyOn(component, 'loadSavingsChart');
    const spyPerAccount = vi.spyOn(component, 'loadChartPerAccount');
    const spyReset = vi.spyOn(component, 'resetChartFilters');

    component.showSavings();

    expect(component.activeView).toBe('savings');
    expect(spyLoad).toHaveBeenCalled();
    expect(spyPerAccount).toHaveBeenCalled();
    expect(spyReset).toHaveBeenCalled();
  });

  it('should activate spendings view', () => {
    const spyLoad = vi.spyOn(component, 'loadSpendingChart');
    const spyPerAccount = vi.spyOn(component, 'loadChartPerAccount');
    const spyReset = vi.spyOn(component, 'resetChartFilters');

    component.showSpent();

    expect(component.activeView).toBe('spendings');
    expect(spyLoad).toHaveBeenCalled();
    expect(spyPerAccount).toHaveBeenCalled();
    expect(spyReset).toHaveBeenCalled();
  });

  it('should calculate remaining correctly', () => {
    const result = (component as any).calculateRemaining(200, 500);
    expect(result.remaining).toBe(300);
    expect(result.percentage).toBe(60);
  });

  it('should calculate remaining with zero budget', () => {
    const result = (component as any).calculateRemaining(200, 0);
    expect(result.remaining).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it('should calculate net savings correctly', () => {
    sessionStorage.setItem('userId', 'testUser');

    accountService.getAccounts.mockReturnValue(of([{ budget: { amount: 1000 } }]));

    transactionService.getTransactionSummary
      .mockReturnValue(of({ totalAmount: 800 }))
      .mockReturnValueOnce(of({ totalAmount: 200 }));

    component.loadChart('in');

    expect(component.primaryValue).toBe(600);
    expect(component.remainingValue).toBe(400);
    expect(component.remainingPercentage).toBe(40);
  });

  it('should aggregate category totals across accounts', () => {
    sessionStorage.setItem('userId', 'testUser');

    accountService.getAccounts.mockReturnValue(of([{ _id: 'acc1' }, { _id: 'acc2' }]));

    transactionService.getCategorySummary
      .mockReturnValueOnce(of([{ category: 'Food', totalAmount: 100 }]))
      .mockReturnValueOnce(of([{ category: 'Food', totalAmount: 200 }]));

    component.loadCategoryData('out');

    expect(component.categoryData[0]).toEqual({ name: 'Food', value: 300 });
  });

  it('should trigger CSV generation', () => {
    const createSpy = vi.spyOn(document, 'createElement');

    component.primaryValue = 500;
    component.remainingValue - 200;
    component.remainingPercentage = 40;

    component.generateCSV();

    expect(createSpy).toHaveBeenCalledWith('a');
  });

  it('should trigger PDF generation', () => {
    component.chartContainer = {
      nativeElement: document.createElement('div')
    } as any;

    const setMock = vi.fn().mockReturnThis();
    const fromMock = vi.fn().mockReturnThis();
    const saveMock = vi.fn();

    const html2pdfMock = vi.fn(() => ({
      set: setMock,
      from: fromMock,
      save: saveMock,
    }));

    (window as any).html2pdf = html2pdfMock;

    vi.useFakeTimers();
    component.generatePDF();
    vi.runAllTimers();

    expect(setMock).toHaveBeenCalled();
    expect(fromMock).toHaveBeenCalledWith(component.chartContainer.nativeElement);
    expect(saveMock).toHaveBeenCalled();

    vi.useRealTimers();
  });
});