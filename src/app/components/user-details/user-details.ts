import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { of } from 'rxjs';

/**
 * The UserDetails component is responsible for displaying the details of a specific user based on the user ID provided in the route parameters. It retrieves the user data from the UserService and handles the display logic accordingly.
 */
@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})

/**
 * The UserDetails class defines the component logic for displaying user details. It initializes an empty user list and retrieves the user data based on the user ID from the route parameters when the component is initialized.
 */
export class UserDetails implements OnInit {

  user$!: Observable<any>;
  notFound$!: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user$ = this.route.params.pipe(
      switchMap((params) => {
        const userId = params['id'];
        return this.userService.getUser(userId).pipe(
          catchError((error) => {
            return of(null);
          })
        );
      })
    );

    this.notFound$ = this.user$.pipe(
      map((user) => !user)
    );
  }
}
