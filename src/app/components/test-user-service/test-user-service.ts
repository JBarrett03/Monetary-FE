import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';

/**
 * TestUserService component - tests the UserService functionality.
 * This is a utility component that verifies UserService methods work correctly
 * by running basic tests and displaying results.
 */
@Component({
  selector: 'app-test-user-service',
  imports: [CommonModule],
  providers: [UserService],
  templateUrl: './test-user-service.html',
  styleUrl: './test-user-service.css',
})

/**
 * Component logic for testing UserService operations.
 * Executes service tests on component initialization and logs results.
 */
export class TestUserService implements OnInit {

  /**
   * Array of test result messages
   */
  test_output: string[] = [];

  /**
   * Creates an instance of TestUserService component.
   * @param userService The UserService to be tested.
   */
  constructor(private userService: UserService) { }

  /**
   * Test method to verify fetching a user by ID works correctly.
   * It calls the getUser method of UserService with a known test user ID and checks if the returned email matches the expected value.
   * The result of the test is logged to the test_output array for display in the component template.
   */
  private testGetUser() {
    this.userService.getUser('6985caceef72e64ca33d5914').subscribe(
      (response: any) => {
        if (response.email === 'testuser@example.com')
          this.test_output.push("Fetch test user by Id ... PASSED")
        else
          this.test_output.push("Fetch test user by Id ... FAILED")
      }
    )
  }

  /**
   * Initializes the component and runs the UserService tests.
   * This method is called automatically when the component is initialized. It triggers the testGetUser method to execute the test case for fetching a user by ID.
   * The results of the test are stored in the test_output array, which can be displayed in the component's template for verification.
   */
  ngOnInit() {
    this.testGetUser();
  }

}
