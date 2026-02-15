import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { UserDetails } from './components/user-details/user-details';
import { Login } from './components/login/login';
import { CreateAccount } from './components/create-account/create-account';
import { Accounts } from './components/accounts/accounts';
import { AccountDetails } from './components/account-details/account-details';
import { TransactionDetails } from './components/transaction-details/transaction-details';
import { Payments } from './components/payments/payments';
import { Spending } from './components/spending/spending';
import { ManageAccounts } from './components/manage-accounts/manage-accounts';

/**
 * Routes for the application.
 */
export const routes: Routes = [
    /**
     * Home route.
     */
    {
        path: '',
        component: Home
    },
    /**
     * Login route.
     */
    {
        path: 'login',
        component: Login
    },
    /**
     * Create account route.
     */
    {
        path: 'create-account',
        component: CreateAccount
    },
    /**
     * Accounts route.
     */
    {
        path: 'accounts',
        component: Accounts
    },
    /**
     * Account details route.
     */
    {
        path: 'accounts/:accountId',
        component: AccountDetails
    },
    /**
     * Transaction details route.
     */
    {
        path: 'accounts/:accountId/transactions/:transactionId',
        component: TransactionDetails
    },
    /**
     * User details route.
     */
    {
        path: 'user-details/:userId',
        component: UserDetails
    },
    /**
     * Payments route.
     */
    {
        path: 'payments',
        component: Payments
    },
    /**
     * Spending route.
     */
    {
        path: 'spending',
        component: Spending
    },
    /**
     * Manage accounts route.
     */
    {
        path: 'manage-accounts',
        component: ManageAccounts
    }
];
