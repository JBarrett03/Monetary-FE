import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account-service';
import { TransactionService } from '../../services/transaction-service';
import { Pie } from '../charts/pie/pie';
import { MatSelectModule } from '@angular/material/select';
/**
 * Spending component - displays budget and spending analytics with interactive charts.
 * Provides two views: 'savings' (remaining budget) and 'spent' (amount spent from budget).
 * Uses Highcharts to visualize budget breakdown and spending patterns.
 * Includes slide-in panel animation for viewing details and data export capability.
 */
@Component({
  selector: 'app-spending',
  standalone: true,
  imports: [CommonModule, Pie, MatSelectModule],
  templateUrl: './spending.html',
  styleUrl: './spending.css',
})

/**
 * Component logic for budget analytics and spending visualization.
 * Toggles between savings and spending views, loads account data, and renders Highcharts visualizations.
 */
export class Spending {

  /**
   * Constructor for Spending component.
   * @param accountService Service for fetching account and budget data
   * @param transactionService Service for fetching transaction data
   */
  constructor(private accountService: AccountService, private transactionService: TransactionService) { }

  /**
 * The account object containing account information such as balance, account number,
 * currency, and account type (e.g., 'savings', 'checking'). Null until account data is loaded.
 */
  account: any | null = null;

  /**
   * The active view for spending analytics, which can be 'savings', 'spent', or null (no view).
   * This variable controls which spending analytics view is currently displayed to the user.
   */
  activeView: 'savings' | 'spent' | null = null;

  /**
   * Calculated primary chart value for the selected mode.
   */
  primaryValue = 0;

  /**
   * Calculated remaining chart value for the selected mode.
   */
  remainingValue = 0;

  /**
   * List of available time periods for filtering analytics data.
   */
  period_list = ['Weekly', 'Monthly', 'Yearly', 'Custom'];

  /**
   * Method to show the savings view, which displays analytics related to money saved.
   * Sets the activeView variable to 'savings' to trigger the display of the savings analytics.
   */
  showSavings() {
    this.activeView = 'savings';
    setTimeout(() => {
      this.loadSavingsChart();
    });
  }

  /**
   * Method to show the spent view, which displays analytics related to money spent.
   * Sets the activeView variable to 'spent' to trigger the display of the spending analytics.
   */
  showSpent() {
    this.activeView = 'spent';
    setTimeout(() => {
      this.loadSpendingChart();
    });
  }

  /**
   * Method to close the currently active view and return to the default state with no analytics displayed.
   * Sets the activeView variable to null, which hides any active analytics view.
   */
  closeView() {
    this.activeView = null;
  }

  /**
  * Loads the savings chart data and updates chart input values.
   */
  loadSavingsChart() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) return;

    this.accountService.getAccount(userId, accountId).subscribe(account => {
      if (!account.budget) return;

      const totalBudget = account.budget.amount;

      this.transactionService.getTransactionSummary(userId, accountId, 'in').subscribe(summary => {
        const budget = summary.totalAmount || 0;
        const remaining = Math.max(totalBudget - budget, 0);

        this.primaryValue = budget;
        this.remainingValue = remaining;
      });
    });
  }

  /**
   * Loads the spending chart data and updates chart input values.
   */
  loadSpendingChart() {
    const userId = sessionStorage.getItem('userId');
    const accountId = sessionStorage.getItem('accountId');

    if (!userId || !accountId) return;

    this.accountService.getAccount(userId, accountId).subscribe(account => {
      if (!account.budget) return;

      const totalSpent = account.budget.amount - account.budget.remaining;

      this.transactionService.getTransactionSummary(userId, accountId, 'out').subscribe(summary => {
        const spent = summary.totalAmount || 0;
        const remaining = Math.max(totalSpent - spent, 0);

        this.primaryValue = spent;
        this.remainingValue = remaining;
      });
    })
  }

  onChange(event: any) {
    console.log('Selected period:', event.value);
  }
}
