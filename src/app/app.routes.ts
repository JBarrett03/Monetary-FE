import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Test } from './components/test/test';
import { UserDetails } from './components/user-details/user-details';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'users',
        component: Test
    },
    {
        path: 'users/:id',
        component: UserDetails
    }
];
