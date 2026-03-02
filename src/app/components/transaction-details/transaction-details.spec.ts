import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { TransactionDetails } from './transaction-details';
import { TransactionService } from '../../services/transaction-service';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('TransactionDetails', () => {
  let component: TransactionDetails;
  let fixture: ComponentFixture<TransactionDetails>;
  let transactionServiceMock: any;

  beforeEach(async () => {
    transactionServiceMock = {
      getTransaction: vi.fn()
    };
    await TestBed.configureTestingModule({
      imports: [TransactionDetails],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            paramMap: of({
              get: (key: string) => key === 'accountId' ? 'a1' : 't1'
            })
          }
        },
        { provide: TransactionService, useValue: transactionServiceMock },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => { } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetails);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error if no userId', () => {
    sessionStorage.removeItem('userId');
    component.ngOnInit();
    expect(component.error).toBe('Invalid user ID');
  });

  it('should load transaction successfully', () => {
    sessionStorage.setItem('userId', 'u1');
    transactionServiceMock.getTransaction.mockReturnValue(of({ id: 't1' }));
    component.ngOnInit();
    expect(component.transaction).toEqual({ id: 't1' });
  });

  it('should set error if transaction not found', () => {
    sessionStorage.setItem('userId', 'u1');
    transactionServiceMock.getTransaction.mockReturnValue(throwError(() => new Error('Not found')));
    component.ngOnInit();
    expect(component.error).toBe('Transaction not found');
  });
});
