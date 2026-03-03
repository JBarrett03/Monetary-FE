import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountService } from '../../services/account-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Accounts } from './accounts';
import { ActivatedRoute } from '@angular/router';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;
  let accountServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    sessionStorage.clear();
    accountServiceMock = { getAccounts: vi.fn(), addAccount: vi.fn() };
    routerMock = { navigate: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Accounts],
      providers: [
        { provide: AccountService, useValue: accountServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: { open: vi.fn() } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load accounts on init', () => {
    sessionStorage.setItem('userId', 'user123');

    accountServiceMock.getAccounts.mockReturnValue(
      of([{ accountType: 'savings', nickname: 'Holiday Fund' }])
      );
    component.ngOnInit();

    expect(accountServiceMock.getAccounts).toHaveBeenCalledWith('user123');
    expect(component.accounts_list.length).toBe(1);
    expect(component.allAccounts.length).toBe(1);
  });

  it('should not load accounts if userId is missing', () => {
    component.ngOnInit();
    expect(accountServiceMock.getAccounts).not.toHaveBeenCalled();
  });

  it('should add a new account', () => {
    sessionStorage.setItem('userId', 'user123');
    component.showAddAccountForm = true;
    component.newAccountType = 'savings';
    component.newAccountCurrency = 'GBP';

    accountServiceMock.addAccount.mockReturnValue(of({}));
    accountServiceMock.getAccounts.mockReturnValue(of([]));

    component.addAccount();

    expect(accountServiceMock.addAccount).toHaveBeenCalled();
    expect(component.showAddAccountForm).toBe(false);
    expect(component.newAccountType).toBe('');
  });

  it('should toggle menu', () => {
    expect(component.menuOpen).toBe(false);
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);
  });

  it('should filter accounts by nickname', () => {
    component.allAccounts = [
      { accountType: 'savings', nickname: 'Holiday' },
      { accountType: 'current', nickname: 'Daily' }
    ];
    component.accounts_list = [...component.allAccounts];
    component.customCategory = 'hol';
    component.selectedCategory = '';
    component.applyFilter();
    expect(component.accounts_list.length).toBe(1);
    expect(component.accounts_list[0].nickname).toBe('Holiday');
  })
});
