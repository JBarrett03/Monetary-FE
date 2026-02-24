import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account-service';
import { TransactionService } from '../../services/transaction-service';
import { Pie } from '../charts/pie/pie';
import { HorizontalBar } from '../charts/horizontal-bar/horizontal-bar';
import { MatSelectModule } from '@angular/material/select';
import { Line } from '../charts/line/line';
import html2pdf from 'html2pdf.js';

/**
 * Spending component allows users to visualize their spending and savings through various charts.
 * It provides options to view savings, spending, and category breakdowns, as well as the ability to export charts as PDF.
 * The component interacts with AccountService and TransactionService to fetch necessary data for analytics.
 */
@Component({
  selector: 'app-spending',
  standalone: true,
  imports: [CommonModule, Pie, HorizontalBar, Line, MatSelectModule],
  templateUrl: './spending.html',
  styleUrl: './spending.css',
})

/**
 * The Spending class manages the state and logic for the spending analytics component. It handles user interactions, data fetching, and chart rendering based on the selected view and chart type.
 * It uses Angular's ViewChild to reference the chart container for PDF generation and subscribes to services to retrieve account and transaction data for analytics.
 * The class includes methods for showing savings and spending views, loading charts based on the selected period and chart type, and generating a PDF report of the current chart.
 * It maintains state variables for the active view, primary and remaining values for analytics, category data for charts, and account analytics for detailed breakdowns.
 */
export class Spending {

  /**
   * ViewChild to reference the chart container element for PDF generation. This allows the component to capture the current chart view and export it as a PDF file when the user requests it.
   * The chartContainer is accessed in the generatePDF method to create a PDF from the current chart view using the html2pdf library.
   */
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  /**
   * Constructor for the Spending component. It injects the AccountService and TransactionService to allow the component to fetch necessary data for analytics and chart rendering. The services are used in various methods to retrieve account information, transaction summaries, and category breakdowns based on user interactions.
   * @param accountService The service used to fetch account information and analytics.
   * @param transactionService The service used to fetch transaction summaries and category data.
   */
  constructor(private accountService: AccountService, private transactionService: TransactionService) { }

  /**
   * State variable to hold the currently selected account for analytics. This variable is used to determine which account's data to fetch and display in the charts. It can be set to null when no account is selected or when the component is initialized without a specific account context.
   * The account variable is used in methods that load charts and category data to ensure that the correct account's information is being analyzed and displayed to the user.
   */
  account: any | null = null;

  /**
   * State variable to track the currently active view in the component. It can be set to 'savings', 'spent', or null depending on the user's selection. This variable is used to determine which chart and data to display based on whether the user wants to see their savings, spending, or if no view is currently active.
   * The activeView variable is checked in various methods to load the appropriate charts and data when the user interacts with the component's UI elements.
   */
  activeView: 'savings' | 'spent' | null = null;

  /**
   * State variable to hold the primary value for analytics, such as total savings or total spending. This variable is updated based on the data fetched from the services and is used in the charts to represent the main value being analyzed.
   * The primaryValue variable is calculated in the loadChart method based on the transaction summaries retrieved for the selected accounts and is displayed in the charts to provide insights into the user's financial habits.
   */
  primaryValue = 0;

  /**
   * State variable to hold the remaining value for analytics, such as remaining budget or remaining savings goal. This variable is updated based on the data fetched from the services and is used in the charts to represent the difference between the goal and the actual value.
   * The remainingValue variable is calculated in the loadChart method by comparing the total goal with the actual value retrieved from transaction summaries, providing users with insights into how much they have left to save or spend based on their goals.
   */
  remainingValue = 0;

  /**
   * List of time periods available for selection in the component. This list is used to populate a dropdown or selection menu that allows users to choose the time frame for which they want to view their spending or savings analytics. The options include 'Weekly', 'Monthly', 'Yearly', and 'Custom', providing flexibility for users to analyze their financial data over different periods.
   * The period_list variable is used in the template to generate the options for the period selection, and the selected period is used in methods that load charts to fetch data corresponding to the chosen time frame.
   */
  period_list = ['Weekly', 'Monthly', 'Yearly', 'Custom'];

  /**
   * State variable to track the currently selected time period for analytics. This variable is updated when the user selects a different time period from the dropdown or selection menu. It is used in methods that load charts to determine which time frame of data to fetch and display in the charts.
   * The selectedPeriod variable is checked in the onPeriodChange method to ensure that the correct data is loaded based on the user's selection, allowing them to analyze their financial habits over different periods such as weekly, monthly, yearly, or custom ranges.
   */
  selectedPeriod: string = 'Weekly';

  /**
   * State variable to track the currently selected chart type for displaying analytics. It can be set to 'Pie', 'Bar', 'Line', or null depending on the user's selection. This variable is used to determine which type of chart to render based on the user's preference for visualizing their spending or savings data.
   * The selectedChartType variable is updated in the onChartTypeChange method when the user selects a different chart type, and it is used in the template to conditionally render the appropriate chart component based on the current selection.
   */
  selectedChartType: 'Pie' | 'Bar' | 'Line' | null = null;

  /**
   * List of available chart types for visualizing analytics. This list is used to populate a dropdown or selection menu that allows users to choose how they want to visualize their spending or savings data. The options include 'Pie', 'Bar', and 'Line', providing users with different ways to interpret their financial data.
   * The chart_type_list variable is used in the template to generate the options for the chart type selection, and the selected chart type is used in methods that load charts to determine which chart component to render based on the user's choice.
   */
  chart_type_list = ['Pie', 'Bar', 'Line'];

  /**
   * State variable to hold the category data for analytics. This variable is an array of objects, where each object represents a category with its name and corresponding value (such as total amount spent or saved in that category). This data is used to populate charts that show category breakdowns, such as a pie chart or bar chart, providing users with insights into which categories they are spending or saving the most in.
   * The categoryData variable is updated in the loadCategoryData method based on the data fetched from the services, and it is used in the template to render charts that display category analytics when the user selects a chart type that requires this data.
   */
  categoryData: { name: string, value: number }[] = [];

  /**
   * State variable to hold the account analytics data for detailed breakdowns. This variable is an array of objects, where each object contains information about an account, including its ID, name, primary value (such as total amount spent or saved), and remaining value (such as remaining budget or savings goal). This data is used to populate charts that show account-level analytics, providing users with insights into how each of their accounts is performing in terms of spending or savings.
   * The accountAnalytics variable is updated in the loadChart method based on the data fetched from the services for each account, and it is used in the template to render charts that display account analytics when the user selects a chart type that requires this data.
   */
  accountAnalytics: { accountId: string, accountName: string, primaryValue: number, remainingValue: number }[] = [];

  /**
   * Method to generate a PDF report of the current chart view. This method uses the html2pdf library to capture the content of the chart container and create a PDF file that can be downloaded by the user. The method checks if the chart container element is available, and if so, it sets the options for the PDF generation, including margins, filename, image quality, and PDF format. It then calls the html2pdf function to create and save the PDF based on the current chart view.
   * This functionality allows users to easily export their spending or savings analytics as a PDF report for sharing or personal record-keeping.
   */
  generatePDF(): void {
    if (!this.chartContainer?.nativeElement) return;

    const content = this.chartContainer.nativeElement;
    setTimeout(() => {
      const options = {
        margin: 10,
        filename: 'spending_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          scrollY: 0 },
        jsPDF: { 
          unit: 'pt', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pageBreak: { mode: ['css', 'legacy'] }
      };
      (html2pdf as any)().set(options).from(content).save();
    }, 500);
  }

  /**
   * Method to show the savings view in the component. This method sets the activeView state variable to 'savings' and calls the loadSavingsChart method to fetch and display the savings analytics in the appropriate chart format. When this method is called, it updates the UI to reflect that the user is now viewing their savings data, allowing them to analyze their financial habits related to saving money.
   * This method is typically triggered by a user interaction, such as clicking a button or selecting an option to view savings analytics, and it ensures that the correct data and charts are loaded for the savings view.
   */
  showSavings() {
    this.activeView = 'savings';
    this.resetChartFilters();
    this.loadSavingsChart();
  }

  /**
   * Method to show the spending view in the component. This method sets the activeView state variable to 'spent' and calls the loadSpendingChart method to fetch and display the spending analytics in the appropriate chart format. It also calls the loadCategoryData method with the 'out' direction to fetch category breakdowns for spending, allowing users to see which categories they are spending the most in.
   * When this method is called, it updates the UI to reflect that the user is now viewing their spending data, providing insights into their financial habits related to spending money. This method is typically triggered by a user interaction, such as clicking a button or selecting an option to view spending analytics, and it ensures that the correct data and charts are loaded for the spending view.
   */
  showSpent() {
    this.activeView = 'spent';
    this.resetChartFilters();
    this.loadSpendingChart();
  }

  /**
   * Method to close the current view in the component. This method sets the activeView state variable to null, effectively hiding any currently displayed charts and analytics. When this method is called, it updates the UI to reflect that no specific view is active, allowing users to return to a neutral state where they can choose to view either savings or spending analytics again.
   * This method is typically triggered by a user interaction, such as clicking a "Close" button or selecting an option to exit the current view, and it ensures that the component resets its state appropriately when the user decides to close the analytics view.
   */
  closeView() {
    this.activeView = null;
  }

  /**
   * Method to load the chart data based on the specified direction ('in' for savings and 'out' for spending). This method retrieves the user's accounts and their corresponding transaction summaries to calculate the primary and remaining values for analytics. It updates the accountAnalytics array with detailed information for each account, including the account name, primary value, and remaining value.
   * The method also calculates the overall goal and actual values across all accounts to update the primaryValue and remainingValue state variables, which are used in the charts to provide insights into the user's financial habits. This method is called by both loadSavingsChart and loadSpendingChart methods to fetch and display the appropriate data based on the selected view.
   */
  loadChart(direction: 'in' | 'out') {
    const userId = sessionStorage.getItem('userId');

    if (!userId) return;

    this.primaryValue = 0;
    this.remainingValue = 0;
    this.accountAnalytics = [];

    this.accountService.getAccounts(userId).subscribe(accounts => {
      const budgetAccounts = accounts.filter(a => a?.budget?.amount);

      if (budgetAccounts.length === 0) return;

      let goal = 0;
      let actual = 0;
      let completed = 0;

      budgetAccounts.forEach(account => {
        goal += Number(account.budget.amount);
        this.transactionService.getTransactionSummary(userId, account._id, direction).subscribe(summary => {
          actual += Number(summary?.totalAmount || 0);
          const accountBalance = Number(summary?.totalAmount || 0);
          const accountGoal = Number(account.budget.amount);

          this.accountAnalytics.push({
            accountId: account._id,
            accountName: account.nickname || account.accountNumber,
            primaryValue: accountBalance,
            remainingValue: Math.max(accountGoal - accountBalance, 0)
          })
          completed += 1;

          if (completed === budgetAccounts.length) {
            this.primaryValue = actual;
            this.remainingValue = Math.max(goal - actual, 0);
          }
        });
      });
    });
  }

  /**
   * Method to load the savings chart data. This method calls the loadChart method with the 'in' direction to fetch and display the savings analytics in the appropriate chart format. It retrieves the user's accounts and their corresponding transaction summaries for incoming transactions (savings) to calculate the primary and remaining values for analytics.
   * When this method is called, it updates the UI to reflect that the user is now viewing their savings data, allowing them to analyze their financial habits related to saving money. This method is typically triggered by a user interaction, such as clicking a button or selecting an option to view savings analytics, and it ensures that the correct data and charts are loaded for the savings view.
   */
  loadSavingsChart() {
    this.loadChart('in');
  }

  /**
   * Method to load the spending chart data. This method calls the loadChart method with the 'out' direction to fetch and display the spending analytics in the appropriate chart format. It retrieves the user's accounts and their corresponding transaction summaries for outgoing transactions (spending) to calculate the primary and remaining values for analytics.
   * When this method is called, it updates the UI to reflect that the user is now viewing their spending data, providing insights into their financial habits related to spending money. This method is typically triggered by a user interaction, such as clicking a button or selecting an option to view spending analytics, and it ensures that the correct data and charts are loaded for the spending view.
   */
  loadSpendingChart() {
    this.loadChart('out');
  }

  /**
   * Method to handle changes in the selected time period for analytics. This method is triggered when the user selects a different time period from the dropdown or selection menu. It updates the selectedPeriod state variable and, if there is an active view (savings or spending), it calls the loadChart method with the appropriate direction to fetch and display the data for the newly selected time period.
   * When this method is called, it ensures that the charts are updated to reflect the new time frame chosen by the user, allowing them to analyze their financial habits over different periods such as weekly, monthly, yearly, or custom ranges based on their preferences.
   */
  onPeriodChange(event: any) {
    this.selectedPeriod = event.value;
    if (!this.activeView) return;
    this.loadChart(this.activeView === 'savings' ? 'in' : 'out');
  }

  /**
   * Method to handle changes in the selected chart type for analytics. This method is triggered when the user selects a different chart type from the dropdown or selection menu. It updates the selectedChartType state variable and, if the selected chart type is 'Bar', it calls the loadCategoryData method with the appropriate direction based on the currently active view (savings or spending) to fetch and display the category breakdowns for the selected chart type.
   * When this method is called, it ensures that the charts are updated to reflect the new visualization format chosen by the user, allowing them to interpret their financial data in different ways such as pie charts, bar charts, or line charts based on their preferences.
   */
  onChartTypeChange(event: any) {
    this.selectedChartType = event.value;
    if (this.selectedChartType === 'Bar') {
      const direction = this.activeView === 'savings' ? 'in' : 'out';
      this.loadCategoryData(direction);
    }
  }

  /**
   * Method to load the category data for the selected chart type. This method is called when the user selects the 'Bar' chart type and is responsible for fetching and aggregating the category-wise transaction data for the user's accounts. It calculates the total amounts for each category and updates the categoryData state variable, which is then used to render the bar chart.
   * @param direction - The direction of the transactions to fetch ('in' for savings, 'out' for spending).
   */
  loadCategoryData(direction: 'in' | 'out') {
    const userId = sessionStorage.getItem('userId');

    if (!userId) return;

    this.accountService.getAccounts(userId).subscribe(accounts => {
      const totals: Record<string, number> = {};
      let completed = 0;

      if (!accounts || accounts.length === 0) {
        this.categoryData = [];
        return;
      }

      accounts.forEach(account => {
        this.transactionService.getCategorySummary(userId, account._id, direction).subscribe(data => {
          data.forEach((item: any) => {
            totals[item.category] = (totals[item.category] || 0) + Number(item.totalAmount || 0);
          });
          completed += 1;

          if (completed === accounts.length) {
            this.categoryData = Object.entries(totals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
          }
        });
      });
    });
  }

  /**
   * Method to reset the chart filters to their default values. This method is typically called when the user wants to clear any applied filters and return to the default view of the charts. It resets the selectedPeriod to 'Monthly' and clears the selectedChartType, allowing the charts to be reloaded with the default settings.
   * When this method is called, it ensures that any custom filters or selections made by the user are cleared, providing a way for users to easily return to a standard view of their spending or savings analytics without any specific time period or chart type filters applied.
   */
  resetChartFilters() {
    this.selectedPeriod = 'Weekly';
    this.selectedChartType = null;
  }
}
