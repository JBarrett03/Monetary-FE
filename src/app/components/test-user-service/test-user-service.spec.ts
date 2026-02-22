import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUserService } from './test-user-service';

describe('TestUserService', () => {
  let component: TestUserService;
  let fixture: ComponentFixture<TestUserService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestUserService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestUserService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
