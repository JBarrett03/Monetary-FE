/**
 * List of account categories used in the application. These categories are used to classify different types of bank accounts, such as current accounts and savings accounts.
 * The 'as const' assertion ensures that the array is treated as a tuple of string literals, providing type safety when using these categories throughout the application.
 */
export const ACCOUNT_CATEGORIES = [
    'Current',
    'Savings',
] as const;