export const currentUser = {
  name: "Obakeng",
  initials: "OR",
  email: "obakeng@email.com",
  track: "Balanced growth",
  grossSalary: 45000,
  paye: 11800,
  takeHome: 33200,
  spending: {
    fixedCosts: 18400,
    discretionary: 9600,
    savedInvested: 3200,
    invisibleCosts: 2000,
  },
  breakdown: [
    { label: "Rent + car", amount: 14200, color: "#5F5E5A" },
    { label: "Food + dining", amount: 5800, color: "#888780" },
    { label: "Subscriptions", amount: 3200, color: "#B4B2A9" },
    { label: "Other", amount: 4800, color: "#D3D1C7" },
  ],
  saContext: {
    medicalAid: 1350,
    medicalAidName: "Discovery Active Smart",
    raContribution: 2250,
    bankCharges: 189,
    creditCardInterest: 840,
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
  ],
  trend: {
    months: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    income: [31000, 31500, 33000, 33200, 33200, 33200],
    expenses: [28000, 29500, 30500, 31000, 31800, 32100],
  },
};
