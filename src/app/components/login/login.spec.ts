import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let httpClientMock: any;
  let routerMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    sessionStorage.clear();
    httpClientMock = { post: vi.fn() };
    routerMock = { navigate: vi.fn() };
    snackBarMock = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in successfully', async () => {
    component.email = 'testuser@example.com';
    component.password = 'password';

    httpClientMock.post.mockReturnValue(of({ userId: 'user123', token: 'token123' }));

    component.onSubmit();
    fixture.detectChanges();

    expect(sessionStorage.getItem('userId')).toBe('user123');
    expect(sessionStorage.getItem('token')).toBe('token123');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Login successful',
      'Dismiss',
      expect.any(Object)
    );
  });

  it('should handle login failure', async () => {
    httpClientMock.post = vi.fn(() => 
      throwError(() => new Error('Login failed')));

    component.onSubmit();
    fixture.detectChanges();

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Please fill in all required fields.',
      'OK',
      expect.any(Object)
    );

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should close login modal and navigate home', () => {
    component.showLoginModal = true;
    component.closeLogin();
    expect(component.showLoginModal).toBeFalsy();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
