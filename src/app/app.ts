import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Test } from './components/test/test';
import userData from '../assets/users.json';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Test],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  ngOnInit() {

    console.log(userData);
    
  }
}
