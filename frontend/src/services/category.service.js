// frontend/src/services/category.service.js

export const categories = [
    { label: 'Food & Dining', value: 'Food' },
    { label: 'Transportation', value: 'Transportation' },
    { label: 'Housing', value: 'Housing' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Education', value: 'Education' },
    { label: 'Salary/Income', value: 'Income' },
    { label: 'Investments', value: 'Investments' },
    { label: 'Other', value: 'Other' },
];

// Helper to get category label from its value (useful for display)
export const getCategoryLabel = (value) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
};