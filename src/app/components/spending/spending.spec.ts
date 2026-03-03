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
});