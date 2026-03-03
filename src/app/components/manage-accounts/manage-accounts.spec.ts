import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountService } from '../../services/account-service';
import { ManageAccounts } from './manage-accounts';
import { UserService } from '../../services/user-service';
import { UtilityService } from '../../services/utility-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('ManageAccounts', () => {
  let component: ManageAccounts;
  let fixture: ComponentFixture<ManageAccounts>;
  let accountServiceMock: any;

  beforeEach(async () => {
    sessionStorage.clear();
    accountServiceMock = {
      saveAccountOrder: vi.fn(),
      restoreArchivedAccount: vi.fn(),
      getAccounts: vi.fn()
    };
    await TestBed.configureTestingModule({
      imports: [ManageAccounts],
      providers: [
        { provide: AccountService, useValue: accountServiceMock },
        { provide: UserService, useValue: {} },
        { provide: UtilityService, useValue: { toTime: (d: string) => new Date(d).getTime() } },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAccounts);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort accounts by balance ascending', () => {
    component.accounts_list = [
      { name: 'Account A', availableBalance: 200 },
      { name: 'Account B', availableBalance: 100 },
      { name: 'Account C', availableBalance: 300 }
    ];
    component.applySort('balanceAsc');
    expect(component.accounts_list[0].availableBalance).toBe(100);
  });

  it('should map correct payload when saving order', () => {
    sessionStorage.setItem('userId', 'user123');
    accountServiceMock.saveAccountOrder.mockReturnValue(of({}));

    component.accounts_list = [
      { _id: 'acc1' },
      { _id: 'acc2' },
      { _id: 'acc3' }
    ];
    component.saveOrder();
    expect(accountServiceMock.saveAccountOrder).toHaveBeenCalledWith('user123', [
      { accountId: 'acc1', order: 0 },
      { accountId: 'acc2', order: 1 },
      { accountId: 'acc3', order: 2 }
    ]);
  });

  it('should remove restored account from archived account list', () => {
    sessionStorage.setItem('userId', 'user123');

    component.archived_list = [
      { _id: 'acc1' },
      { _id: 'acc2' }
    ];

    accountServiceMock.restoreArchivedAccount.mockReturnValue(of({}));
    accountServiceMock.getAccounts.mockReturnValue(of([]));

    component.restoreArchivedAccount('acc1');

    expect(component.archived_list.length).toBe(1);
    expect(component.archived_list[0]._id).toBe('acc2');
  });

  it('should toggle menu correctly', () => {
    component.toggleMenu('acc1');
    expect(component.openMenu).toBe('acc1');

    component.toggleMenu('acc1');
    expect(component.openMenu).toBeNull();
  });

  it('should toggle sort options visibility', () => {
    component.showSortOptions = false;
    component.toggleSortOptions();
    expect(component.showSortOptions).toBe(true);
    component.toggleSortOptions();
    expect(component.showSortOptions).toBe(false);
  });

  it('should sort accounts by opened date descending', () => {
    component.accounts_list = [
      { name: 'Account A', openedAt: '2024-01-01' },
      { name: 'Account B', openedAt: '2024-03-01' },
      { name: 'Account C', openedAt: '2024-02-01' }
    ];
    component.applySort('openedAtDesc');
    expect(component.accounts_list[0].openedAt).toBe('2024-03-01');
    expect(component.accounts_list[1].openedAt).toBe('2024-02-01');
    expect(component.accounts_list[2].openedAt).toBe('2024-01-01');
  });
});