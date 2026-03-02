import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../services/user-service';

@Component({
  selector: 'app-test-user-service',
  imports: [],
  providers: [UserService],
  templateUrl: './test-user-service.html',
  styleUrl: './test-user-service.css',
})

export class TestUserService {

  test_output: string[] = [];

  userId = '6985caceef72e64ca33d5914';

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.testGetUser();
    this.testCreateUser();
    this.testEditUser();
    this.testChangePassword();
  }

  private testGetUser() {
    this.userService.getUser(this.userId).subscribe((response: any) => {
      if (response && typeof response === 'object') {
        this.test_output.push("Page of user fetched... PASS");
      } else {
        this.test_output.push("Page of user fetched... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testCreateUser() {
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test.user.${Date.now()}@example.com`,
      password: 'TestPassword123',
      phone: '1234567890',
      address: '123 Test St, Test City, TS 12345',
      DOB: '1990-01-01'
    };

    this.userService.createUser(newUser).subscribe((response: any) => {
      if (response && response.id) {
        this.test_output.push("Create user... PASS");
      } else {
        this.test_output.push("Create user... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testEditUser() {
    const updatedUser = {
      firstName: 'Updated',
      lastName: 'User',
      email: `updated.user.${Date.now()}@example.com`,
      phone: '0987654321',
      address: '456 Updated St, Updated City, US 54321'
    };

    this.userService.editUser(this.userId, updatedUser).subscribe((response: any) => {
      if (response && response.message === 'User updated successfully') {
        this.test_output.push("Edit user... PASS");
      } else {
        this.test_output.push("Edit user... FAIL");
      }
      this.cdr.detectChanges();
    });
  }

  private testChangePassword() {
    const newUser = {
      firstName: 'Password',
      lastName: 'Tester',
      email: `password.tester.${Date.now()}@example.com`,
      password: 'InitialPass123',
      phone: '1112223333',
      address: '789 Password St, Password City, PW 67890',
      DOB: '1995-05-05'
    };

    this.userService.createUser(newUser).subscribe((createdResponse: any) => {
      const userId = createdResponse.id;
      this.userService.changePassword(userId, 'InitialPass123', 'NewPass456').subscribe((changeResponse: any) => {
        if (changeResponse && changeResponse.message === 'Password changed successfully') {
          this.test_output.push("Change password... PASS");
        } else {
          this.test_output.push("Change password... FAIL");
        }
        this.cdr.detectChanges();
      })
    });
  }
}
