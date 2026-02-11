/**
 * This file defines a constant array of transaction categories used in the application.
 * Each category represents a type of transaction that users can classify their expenses or income under.
 * The categories are defined as a tuple of string literals to ensure type safety when used throughout the app.
 */
export const TRANSACTION_CATEGORIES = [
    'Groceries',
    'Dining',
    'Rent',
    'Utilities',
    'Transport',
    'Shopping',
    'Entertainment',
    'Health',
    'Travel',
    'Subscriptions',
    'Income',
    'Transfers',
    'Miscellaneous'
] as const;
