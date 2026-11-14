// TODO: Replace this sample data with income, expense, and savings goal API calls.
export const incomeExpensesByMonth = [
  { month: "Jun", monthKey: "2026-06", income: 71000, expenses: 48600 },
  { month: "Jul", monthKey: "2026-07", income: 72000, expenses: 50200 },
  { month: "Aug", monthKey: "2026-08", income: 74000, expenses: 48900 },
  { month: "Sep", monthKey: "2026-09", income: 75500, expenses: 53600 },
  { month: "Oct", monthKey: "2026-10", income: 77000, expenses: 50100 },
  { month: "Nov", monthKey: "2026-11", income: 80000, expenses: 50400 },
].map((item) => ({ ...item, savings: item.income - item.expenses }));

export const initialSavingsGoals = [
  {
    id: 1,
    name: "Emergency fund",
    targetAmount: 150000,
    savedAmount: 67500,
    targetDate: "2027-06-30",
  },
  {
    id: 2,
    name: "Next vacation",
    targetAmount: 80000,
    savedAmount: 32000,
    targetDate: "2027-03-15",
  },
  {
    id: 3,
    name: "New laptop",
    targetAmount: 120000,
    savedAmount: 84000,
    targetDate: "2027-02-01",
  },
];
