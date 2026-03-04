import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility-service';

describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate remaining and percentage correctly', () => {
    const result = service.calculateRemaining(200, 500);
    expect(result.remaining).toBe(300);
    expect(result.percentage).toBe(60);
  });

  it('should return 0 percentage when budget is 0', () => {
    const result = service.calculateRemaining(50, 0);
    expect(result.remaining).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it('should sum all account budgets correctly', () => {
    const accounts = [
      { budget: { amount: 100 } },
      { budget: { amount: 200 } },
      { budget: null },
      { budget: { amount: 50 } },
    ];
    expect(service.getTotalBudget(accounts)).toBe(350);
  });

  it('should prevent non-numeric input', () => {
    const event = { key: 'a', preventDefault: vi.fn() } as any;
    service.numbersOnly(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow numeric input', () => {
    const event = { key: '5', preventDefault: vi.fn() } as any;
    service.numbersOnly(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should return milestone when reached', () => {
    const account = { _id: '1', balance: 250, budget: { amount: 1000 } };
    const result = service.checkSavingsProgress(account);
    expect(result).toBe(25);
  });
});
