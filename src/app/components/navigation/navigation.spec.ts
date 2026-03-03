import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navigation } from './navigation';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Navigation]
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return userId from session storage', () => {
    sessionStorage.setItem('userId', 'user123');
    expect(component.userId).toBe('user123');
  });

  it('should return null if no userId in session storage', () => {
    expect(component.userId).toBeNull();
  });

  it('should return true for isLoggedIn if userId exists', () => {
    sessionStorage.setItem('userId', 'user123');
    expect(component.isLoggedIn).toBe(true);
  });

  it('should return false for isLoggedIn if no userId exists', () => {
    expect(component.isLoggedIn).toBe(false);
  });
});
