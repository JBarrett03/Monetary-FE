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

  /**
   * user$ is an Observable that holds the details of the user to be displayed. It is initialized by retrieving the user data from the UserService based on the user ID from the route parameters.
   * notFound$ is an Observable that indicates whether the user was not found. It is derived from the user$ Observable and emits true if the user data is null, indicating that the user was not found.
   */
  user$!: Observable<any>;

  /**
   * notFound$ is an Observable that indicates whether the user was not found. It is derived from the user$ Observable and emits true if the user data is null, indicating that the user was not found.
   */
  notFound$!: Observable<boolean>;

  /**
   * The constructor injects the ActivatedRoute and UserService to enable access to route parameters and retrieval of user data.
   * @param route - An instance of ActivatedRoute for accessing route parameters.
   * @param userService - An instance of the UserService for making API calls to retrieve user data.
   */
  constructor(private route: ActivatedRoute, private userService: UserService) { }

  /**
   * The ngOnInit lifecycle hook is called when the component is initialized. It retrieves the user ID from the route parameters and uses the UserService to fetch the user data. The retrieved user data is then stored in the user$ Observable for display in the template. If an error occurs during data retrieval, the user$ Observable will emit null, indicating that the user was not found.
   */
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
