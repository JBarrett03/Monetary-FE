import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { AccountService } from '../../services/account-service';
import { Payments } from './payments';
import { UtilityService } from '../../services/utility-service';

describe('Payments', () => {
  let component: Payments;
  let fixture: ComponentFixture<Payments>;
  let accountService: any;

  beforeEach(async () => {
    accountService = {
      getAccount: vi.fn(),
      getAccountByNumber: vi.fn(),
      addBalance: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [Payments],
      providers: [
        { provide: AccountService, useValue: accountService },
        { provide: UtilityService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Payments);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load account on init', () => {
    sessionStorage.setItem('userId', 'testUser');
    sessionStorage.setItem('accountId', 'testAccount');

    const mockAccount = { _id: 'testAccount', balance: 100 };
    accountService.getAccount.mockReturnValue(of(mockAccount));

    component.ngOnInit();

    expect(accountService.getAccount).toHaveBeenCalledWith('testUser', 'testAccount');
    expect(component.account).toEqual(mockAccount);
  });

  it('should load recent payees from localStorage on init', () => {
    sessionStorage.setItem('userId', 'testUser');
    const mockPayees = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    localStorage.setItem('recentPayees_testUser', JSON.stringify(mockPayees));

    accountService.getAccount.mockReturnValue(of({ _id: 'testAccount', balance: 100 }));

    component.ngOnInit();

    expect(component.recentPayees.length).toBe(3);
    expect(component.allPayees.length).toBe(4);
  });

  it('should return correct paged payees', () => {
    component.allPayees = [1, 2, 3, 4];
    component.pageSize = 2;

    component.pageIndex = 0;
    expect(component.pagedPayees).toEqual([1, 2]);

    component.pageIndex = 1;
    expect(component.pagedPayees).toEqual([3, 4]);
  });

  it('should add balance successfully', () => {
    sessionStorage.setItem('userId', 'testUser');
    sessionStorage.setItem('accountId', 'testAccount');

    component.confirmAccountNumber = '12345678';
    component.confirmSortCode = '12-34-56';
    component.amountToAdd = 50;

    const payeeAccount = { _id: 'payeeId', balance: 150 };
    const updatedAccount = { _id: 'testAccount', balance: 150 };
    accountService.getAccountByNumber.mockReturnValue(of(payeeAccount));
    accountService.addBalance.mockReturnValue(of(null));
    accountService.getAccount.mockReturnValue(of(updatedAccount));

    component.addBalance();

    expect(accountService.getAccountByNumber).toHaveBeenCalledWith('testUser', '12345678', '123456');
    expect(accountService.addBalance).toHaveBeenCalledWith('testUser', 'payeeId', 50);
    expect(accountService.getAccount).toHaveBeenCalledWith('testUser', 'testAccount');
    expect(component.account.balance).toBe(150);
    expect(component.showAddBalanceForm).toBe(false);
  });

  it('should open and close balance form', () => {
    component.openBalanceForm();
    expect(component.showAddBalanceForm).toBe(true);

    component.closeBalanceForm();
    expect(component.showAddBalanceForm).toBe(false);
  });

  it('should open and close recent payees', () => {
    component.openShowRecentPayees();
    expect(component.showRecentPayees).toBe(true);

    component.closeShowRecentPayees();
    expect(component.showRecentPayees).toBe(false);
  });

  it('should update pagination on page change', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 5 } as any);

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
  });
});