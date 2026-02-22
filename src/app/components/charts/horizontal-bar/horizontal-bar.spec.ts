import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalBar } from './horizontal-bar';

describe('HorizontalBar', () => {
  let component: HorizontalBar;
  let fixture: ComponentFixture<HorizontalBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
