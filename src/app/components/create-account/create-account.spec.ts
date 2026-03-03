import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { CreateAccount } from './create-account';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

describe('CreateAccount', () => {
  let component: CreateAccount;
  let fixture: ComponentFixture<CreateAccount>;
  let userServiceMock: any;
  let routerMock: any;
  let snackBarMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    userServiceMock = { createUser: vi.fn() };
    routerMock = { navigate: vi.fn() };
    snackBarMock = { open: vi.fn() };
    activatedRouteMock = { snapshot: { queryParams: {} } };

    await TestBed.configureTestingModule({
      imports: [CreateAccount],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccount);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a user with form data', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john.doe@example.com';
    component.password = 'password123';
    component.phone = '1234567890';
    component.address = '123 Main St';
    component.DOB = '1990-01-01';

    userServiceMock.createUser.mockReturnValue(of({ _id: 'user123' }));

    component.onSubmit();

    expect(userServiceMock.createUser).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '1234567890',
      address: '123 Main St',
      DOB: '1990-01-01'
    });
  });

  it('should store userId and navigate to home on successful user creation', async () => {
    sessionStorage.clear();
    userServiceMock.createUser.mockReturnValue(of({ _id: 'user123' }));

    component.onSubmit();
    await fixture.whenStable();

    expect(sessionStorage.getItem('userId')).toBe('user123');
    expect(sessionStorage.getItem('isLoggedIn')).toBe('true');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/accounts']);
  });

  it('should close modal and navigate home', () => {
    component.showCreateAccountModal = true;
    component.closeCreateAccount();
    expect(component.showCreateAccountModal).toBeFalsy();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
