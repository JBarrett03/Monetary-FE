import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountDetails } from './account-details';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account-service';
import { UtilityService } from '../../services/utility-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';

describe('AccountDetails', () => {
  let component: AccountDetails;
  let fixture: ComponentFixture<AccountDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetails],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } },
        { provide: Router, useValue: {} },
        { provide: AccountService, useValue: {} },
        { provide: UtilityService, useValue: { toTime: (date: string) => new Date(date).getTime() } },
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => { } } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AccountDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate budget progress correctly', () => {
    component.account = {
      balance: 50,
      budget: { amount: 100 }
    };
    expect(component.budgetProgress).toBe(50);
  });

  it('should return 0 if no balance', () => {
    component.account = {
      budget: { amount: 100 }
    };
    expect(component.budgetProgress).toBe(0);
  });

  it('should cap budget progress at 100%', () => {
    component.account = {
      balance: 150,
      budget: { amount: 100 }
    };
    expect(component.budgetProgress).toBe(100);
  });

  it('should cap percentage at 100%', () => {
    component.account = {
      balance: 150,
      budget: { amount: 100 }
    };
    expect(component.budgetProgress).toBe(100);
  });

  it('should return 0 if no budget', () => {
    component.account = {};
    expect(component.budgetProgress).toBe(0);
  });

  it('should return false if no budget', () => {
    component.account = {};
    expect(component.isBudgetExceeded).toBeFalsy();
  });

  it('should return true if balance exceeds budget', () => {
    component.account = {
      balance: 150,
      budget: { amount: 100 }
    };
    expect(component.isBudgetExceeded).toBeTruthy();
  });

  it('should return false if balance does not exceed budget', () => {
    component.account = {
      balance: 50,
      budget: { amount: 100 }
    };
    expect(component.isBudgetExceeded).toBeFalsy();
  });

  it('should return false if balance equals budget', () => {
    component.account = {
      balance: 100,
      budget: { amount: 100 }
    };
    expect(component.isBudgetExceeded).toBeFalsy();
  });

  it('should return customCategory if set', () => {
    component.customCategory = 'Food';
    component.selectedCategory = 'Travel';
    expect(component.effectiveCategory).toBe('Food');
  });

  it('should return selectedCategory if customCategory is not set', () => {
    component.customCategory = '';
    component.selectedCategory = 'Travel';
    expect(component.effectiveCategory).toBe('Travel');
  });

  it('should return empty string if neither customCategory nor selectedCategory is set', () => {
    component.customCategory = '';
    component.selectedCategory = '';
    expect(component.effectiveCategory).toBe('');
  });

  it('should toggle filter visibility', () => {
    expect(component.showFilter).toBeFalsy();
    component.toggleFilter();
    expect(component.showFilter).toBeTruthy();
    component.toggleFilter();
    expect(component.showFilter).toBeFalsy();
  });

  it('should clear category filters when toggling filter off', () => {
    component.customCategory = 'Food';
    component.selectedCategory = 'Travel';
    component.toggleFilter();
    expect(component.customCategory).toBe('');
    expect(component.selectedCategory).toBe('');
  });

  it('should toggle showBudgetForm', () => {
    component.showBudgetForm = false;
    component.addBudget();
    expect(component.showBudgetForm).toBeTruthy();

    component.addBudget();
    expect(component.showBudgetForm).toBeFalsy();
  });

  it('should set budgetPeriod when adding budget', () => {
    component.budgetPeriod = 'monthly';
    expect(component.budgetPeriod).toBe('monthly');
  });

  it('should close budget form', () => {
    component.showBudgetForm = true;
    component.closeBudgetForm();
    expect(component.showBudgetForm).toBeFalsy();
  });

  it('should toggle menuOpen', () => {
    component.menuOpen = false;
    component.toggleMenu();
    expect(component.menuOpen).toBeTruthy();
    component.toggleMenu();
    expect(component.menuOpen).toBeFalsy();
  });

  it('should toggle showSortOptions', () => {
    component.showSortOptions = false;
    component.toggleSortOptions();
    expect(component.showSortOptions).toBeTruthy();
    component.toggleSortOptions();
    expect(component.showSortOptions).toBeFalsy();
  });

  it('should sort transactions by ascending date', () => {
    component.transactions = [
      { createdAt: '2024-01-02T00:00:00Z' },
      { createdAt: '2024-01-01T00:00:00Z' }
    ];

    component.applySort('createdAtAsc');
    expect(component.transactions[0].createdAt).toBe('2024-01-01T00:00:00Z');
  });

  it('should sort transactions by descending date', () => {
    component.transactions = [
      { createdAt: '2024-01-01T00:00:00Z' },
      { createdAt: '2024-01-02T00:00:00Z' }
    ];

    component.applySort('createdAtDesc');
    expect(component.transactions[0].createdAt).toBe('2024-01-02T00:00:00Z');
  });
});