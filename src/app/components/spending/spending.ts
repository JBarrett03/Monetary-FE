import { Component } from '@angular/core';

/**
 * Spending component - placeholder for spending analytics features.
 * This component is intended for displaying spending summaries, charts, and analysis.
 * Currently serves as a foundation for future development.
 */
@Component({
  selector: 'app-spending',
  imports: [],
  templateUrl: './spending.html',
  styleUrl: './spending.css',
})

/**
 * Spending class - the component logic for the spending page.
 * To be implemented with spending analysis and visualization features.
 */
export class Spending {

  /**
   * The active view for spending analytics, which can be 'savings', 'spent', or null (no view).
   * This variable controls which spending analytics view is currently displayed to the user.
   */
  activeView: 'savings' | 'spent' | null = null;

  /**
   * Method to show the savings view, which displays analytics related to money saved.
   * Sets the activeView variable to 'savings' to trigger the display of the savings analytics.
   */
  showSavings() {
    this.activeView = 'savings';
  }

  /**
   * Method to show the spent view, which displays analytics related to money spent.
   * Sets the activeView variable to 'spent' to trigger the display of the spending analytics.
   */
  showSpent() {
    this.activeView = 'spent';
  }

  /**
   * Method to close the currently active view and return to the default state with no analytics displayed.
   * Sets the activeView variable to null, which hides any active analytics view.
   */
  closeView() {
    this.activeView = null;
  }

}
