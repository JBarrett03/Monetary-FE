import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Test } from './components/test/test';
import { UserDetails } from './components/user-details/user-details';

/**
 * The routes array defines the routing configuration for the Angular application. It specifies the paths and corresponding components that should be rendered when a user navigates to a specific route. The routes include a default route for the home component, a route for displaying a list of users, and a route for displaying details of a specific user based on the user ID.
 */
export const routes: Routes = [

    /**
     * The default route ('') renders the Home component when the user navigates to the root URL of the application.
     */
    {
        path: '',
        component: Home
    },

    /**
     * The 'users' route renders the Test component when the user navigates to '/users'. This route is responsible for displaying a list of users with pagination functionality.
     */
    {
        path: 'users',
        component: Test
    },

    /**
     * The 'users/:id' route renders the UserDetails component when the user navigates to '/users/:id', where ':id' is a placeholder for the user ID. This route is responsible for displaying the details of a specific user based on the provided user ID in the URL.
     */
    {
        path: 'users/:id',
        component: UserDetails
    }
];
