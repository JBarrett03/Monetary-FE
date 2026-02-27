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

export const TRANSACTION_CATEGORY_META: Record<typeof TRANSACTION_CATEGORIES[number], { icon: string, color: string }> = {
    'Groceries': { icon: 'fa-shopping-cart', color: '#4CAF50' },
    'Dining': { icon: 'fa-utensils', color: '#FF9800' },
    'Rent': { icon: 'fa-home', color: '#2196F3' },
    'Utilities': { icon: 'fa-lightbulb', color: '#9C27B0' },
    'Transport': { icon: 'fa-bus', color: '#FF5722' },
    'Shopping': { icon: 'fa-shopping-bag', color: '#E91E63' },
    'Entertainment': { icon: 'fa-film', color: '#3F51B5' },
    'Health': { icon: 'fa-heartbeat', color: '#F44336' },
    'Travel': { icon: 'fa-plane', color: '#00BCD4' },
    'Subscriptions': { icon: 'fa-file-alt', color: '#8BC34A' },
    'Income': { icon: 'fa-dollar-sign', color: '#4CAF50' },
    'Transfers': { icon: 'fa-exchange-alt', color: '#607D8B' },
    'Miscellaneous': { icon: 'fa-ellipsis-h', color: '#9E9E9E' }
};
