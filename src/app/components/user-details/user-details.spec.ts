import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { UserDetails } from './user-details';

describe('UserDetails', () => {
  let component: UserDetails;
  let fixture: ComponentFixture<UserDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetails],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } },
        { provide: Router, useValue: {} },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => { } } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open password change modal', () => {
    component.changePassword();
    expect(component.changePasswordModal).toBeTruthy();
  });

  it('should close password change modal', () => {
    component.changePasswordModal = true;
    component.closePasswordModal();
    expect(component.changePasswordModal).toBeFalsy();
  });

  it('should toggle password visibility', () => {
    component.showPassword = false;
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTruthy();
  });

  it('should toggle user menu', () => {
    expect(component.showUserMenu).toBeFalsy();
    component.toggleUserMenu();
    expect(component.showUserMenu).toBeTruthy();
  });

  it('should close user menu', () => {
    component.showUserMenu = true;
    component.closeUserMenu();
    expect(component.showUserMenu).toBeFalsy();
  });

  it('should not edit user if no session user ID', () => {
    sessionStorage.removeItem('userId');
    component.editUser();
    expect(component.showEditModal).toBeFalsy();
  });

});
