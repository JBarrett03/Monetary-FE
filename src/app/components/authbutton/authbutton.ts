import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authbutton',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './authbutton.html',
  styleUrl: './authbutton.css',
})
export class Authbutton {

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}

}
