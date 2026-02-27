import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  standalone: true,
  selector: 'app-create-account',
  imports: [FormsModule],
  templateUrl: './create-account.html'
})

export class CreateAccount {

  firstName: string = '';

  lastName: string = '';

  email: string = '';

  password: string = '';

  phone: string = '';

  address: string = '';

  DOB: string = '';

  constructor(private userService: UserService, private router: Router) { }

  onSubmit() {
    const new_user = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address,
      DOB: this.DOB
    };

    this.userService.createUser(new_user).subscribe({
      next: (res: any) => {
        sessionStorage.clear();
        sessionStorage.setItem('userId', res.id)
        sessionStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/accounts']);
      },
      error: err => {
        console.error(err);
      }
    });
  }

}
