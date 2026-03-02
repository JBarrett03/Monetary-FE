import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAccountService } from './test-account-service';

describe('TestAccountService', () => {
  let component: TestAccountService;
  let fixture: ComponentFixture<TestAccountService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAccountService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAccountService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
