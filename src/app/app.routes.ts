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

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'create-account',
        component: CreateAccount
    },
    {
        path: 'accounts',
        component: Accounts
    },
    {
        path: 'accounts/:accountId',
        component: AccountDetails
    },
    {
        path: 'accounts/:accountId/transactions/:transactionId',
        component: TransactionDetails
    },
    {
        path: 'user-details/:userId',
        component: UserDetails
    },
    {
        path: 'payments',
        component: Payments
    },
    {
        path: 'spending',
        component: Spending
    },
    {
        path: 'manage-accounts',
        component: ManageAccounts
    },
];
