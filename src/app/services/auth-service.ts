import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private userActivity$: Subject<void> = new Subject<void>();

  constructor() { }

  login(userId: string, token: string): void {
    sessionStorage.clear();
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('token', token);
  }

  resetUserActivityTimer(timeout: number):void {
    this.userActivity$.next();
    timer(timeout).pipe(takeUntil(this.userActivity$)).subscribe(() => {
      this.logout();
    });
  }

  simulateUserActivity(): void {
    this.userActivity$.next();
  }

  logout(): void {
    sessionStorage.clear();
  }
}
