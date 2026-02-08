import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
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
