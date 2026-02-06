import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountService } from './account-service';

describe('AccountService', () => {
  let component: AccountService;
  let fixture: ComponentFixture<AccountService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
