export const currentUser = {
  name: "Obakeng",
  initials: "OR",
  email: "obakeng@email.com",
  track: "Balanced growth",
  grossSalary: 45000,
  paye: 11800,
  takeHome: 33200,

  categories: [
    {
      id: "housing",
      label: "Housing",
      amount: 9500,
      color: "#a50000",
      description: "Rent, levies, utilities",
    },
    {
      id: "mobility",
      label: "Mobility",
      amount: 7200,
      color: "#8586fe",
      description: "Car repayment, insurance, fuel",
    },
    {
      id: "lifestyle",
      label: "Lifestyle",
      amount: 6800,
      color: "#e8a838",
      description: "Food, dining, subscriptions, entertainment",
    },
    {
      id: "debt",
      label: "Debt",
      amount: 3100,
      color: "#e05c5c",
      description: "Credit card, personal loan repayments",
    },
    {
      id: "savings",
      label: "Savings",
      amount: 3200,
      color: "#3db87a",
      description: "Emergency fund, TFSA, investments",
    },
  ],

  spending: {
    fixedCosts: 18400,
    discretionary: 9600,
    savedInvested: 3200,
    invisibleCosts: 2000,
  },

  saContext: {
    medicalAid: 1350,
    medicalAidName: "Discovery Active Smart",
    raContribution: 2250,
    bankCharges: 189,
    creditCardInterest: 840,
  },

  debts: {
    vehicleFinance: 280000,
    creditCard: 12000,
    personalLoan: 0,
  },

  goals: [
    { id: 1, name: "Emergency fund", current: 4980, target: 9960 },
    { id: 2, name: "TFSA contributions", current: 12000, target: 36000 },
    { id: 3, name: "Property deposit", current: 8000, target: 120000 },
  ],

  nudges: [
    {
      id: 1,
      type: "warning",
      title: "Lifestyle creep detected",
      body: "Your dining spend grew 18% this month — income unchanged.",
    },
    {
      id: 2,
      type: "success",
      title: "Emergency fund on track",
      body: "You've reached 1.5 of 3 months of expenses.",
    },
    {
      id: 3,
      type: "warning",
      title: "Debt-to-income ratio elevated",
      body: "Your debt repayments are 9% of take-home. Aim to keep this under 8%.",
    },
  ],

  trend: {
    months: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    income: [31000, 31500, 33000, 33200, 33200, 33200],
    expenses: [28000, 29500, 30500, 31000, 31800, 32100],
  },
};
