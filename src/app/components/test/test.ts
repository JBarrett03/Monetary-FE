import { Component } from '@angular/core';
import { UserData } from '../../services/user-data';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  standalone: true,
  selector: 'app-test',
  providers: [UserData, UserService],
  imports: [RouterModule],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {

  user_list: any = [];
  page: number = 1;

  constructor(protected userData: UserData, private userService: UserService) { }

  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.userService.getUsers(this.page).subscribe(
      (response) => {
        this.user_list = response;
      }
    )
  }

  previousPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
      sessionStorage['page'] = this.page;
      this.userService.getUsers(this.page).subscribe((response: any) =>{
        this.user_list = response;
      })
    }
  }

  nextPage() {
    if (this.page < this.userData.getLastPageNumber()) {
      this.page = this.page + 1;
      sessionStorage['page'] = this.page;
      this.userService.getUsers(this.page).subscribe((response: any) =>{
        this.user_list = response;
      })
    }
  }
}