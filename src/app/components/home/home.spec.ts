import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { AccountService } from '../../services/account-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let accountServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    accountServiceMock = {
      getDefaultAccount: vi.fn(),
      getAccount: vi.fn(),
      getAccountTransactions: vi.fn()
    };
    routerMock = { navigate: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: AccountService, useValue: accountServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return customCategory is set', () => {
    component.customCategory = 'Food';
    component.selectedCategory = 'Travel';

    expect(component.effectiveCategory).toBe('Food');
  });

  it('should return selectedCategory if customCategory is not set', () => {
    component.customCategory = '';
    component.selectedCategory = 'Travel';
    expect(component.effectiveCategory).toBe('Travel');
  });

  it('should clear categories when filter is cleared', () => {
    component.showFilter = true;
    component.selectedCategory = 'Food';
    component.customCategory = 'Groceries';
    component.toggleFilter();

    expect(component.showFilter).toBeFalsy();
    expect(component.selectedCategory).toBe('');
    expect(component.customCategory).toBe('');
  });

  it('should navigate to transaction details', () => {
    const routerMock = { navigate: vi.fn() };
    component['router'] = routerMock as any;

    component.defaultAccount = { _id: 'account123' };
    component.openTransaction('transaction456');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/accounts', 'account123', 'transactions', 'transaction456']);
  });

  it('should limit transactions to 5', () => {
    sessionStorage.setItem('userId', 'user123');
    sessionStorage.setItem('accountId', 'account123');

    const mockTransactions = [1, 2, 3, 4, 5, 6, 7];

    accountServiceMock.getDefaultAccount.mockReturnValue(of({ _id: 'account123' }));
    accountServiceMock.getAccount.mockReturnValue(of({ _id: 'account123' }));
    accountServiceMock.getAccountTransactions.mockReturnValue(of(mockTransactions));

    component.ngOnInit();

    expect(component.transactions.length).toBe(5);
  });
});
