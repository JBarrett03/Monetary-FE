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
import { TestUserService } from './components/tests/test-user-service/test-user-service';
import { TestUtilityService } from './components/tests/test-utility-service/test-utility-service';
import { TestTransactionService } from './components/tests/test-transaction-service/test-transaction-service';
import { TestAccountService } from './components/tests/test-account-service/test-account-service';

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
    {
        path: 'test-user-service',
        component: TestUserService
    },
    {
        path: 'test-account-service',
        component: TestAccountService
    },
    {
        path: 'test-transaction-service',
        component: TestTransactionService
    },
    {
        path: 'test-utility-service',
        component: TestUtilityService
    },
];
