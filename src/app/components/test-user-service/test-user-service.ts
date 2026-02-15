import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-test-user-service',
  imports: [CommonModule],
  providers: [UserService],
  templateUrl: './test-user-service.html',
  styleUrl: './test-user-service.css',
})
export class TestUserService implements OnInit {

  test_output: string[] = [];

  constructor(private userService: UserService) { }

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

  ngOnInit() {
    this.testGetUser();
  }

}
