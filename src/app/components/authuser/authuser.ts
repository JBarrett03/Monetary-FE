import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authuser',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './authuser.html',
  styleUrl: './authuser.css',
})
export class Authuser {

  constructor(protected auth: AuthService) {}

}
