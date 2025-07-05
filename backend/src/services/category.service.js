// backend/src/services/category.service.js

export const categories = [
    { label: 'Food & Dining', value: 'Food' },
    { label: 'Transportation', value: 'Transportation' },
    { label: 'Housing', value: 'Housing' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Education', value: 'Education' },
    { label: 'Salary/Income', value: 'Income' }, // Good to track income too
    { label: 'Investments', value: 'Investments' },
    { label: 'Other', value: 'Other' },
];

// You might also export just the values for the enum
export const categoryValues = categories.map(cat => cat.value);