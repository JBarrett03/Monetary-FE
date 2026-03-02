import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTransactionService } from './test-transaction-service';

describe('TestTransactionService', () => {
  let component: TestTransactionService;
  let fixture: ComponentFixture<TestTransactionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTransactionService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTransactionService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
