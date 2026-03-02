import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUtilityService } from './test-utility-service';

describe('TestUtilityService', () => {
  let component: TestUtilityService;
  let fixture: ComponentFixture<TestUtilityService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestUtilityService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestUtilityService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
