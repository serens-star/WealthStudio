import { useState } from "react";
import "./Studio.css";
import StudioExplainer from "./StudioExplainer";

function formatR(value) {
  return `R ${Math.round(value).toLocaleString("en-ZA")}`;
}

function safeNum(value, fallback = 0) {
  const n = Number(value);
  return isNaN(n) || !isFinite(n) ? fallback : n;
}

export default function CarStudio() {
  const [inputs, setInputs] = useState({
    carPrice: 600000,
    deposit: 10,
    interestRate: 13,
    insurance: 2500,
    maintenance: 1200,
    years: 5,
  });

  const update = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const months = inputs.years * 12;
  const loanAmount = inputs.carPrice * (1 - inputs.deposit / 100);
  const monthlyRate = inputs.interestRate / 100 / 12;
  const monthlyInstalment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalMonthlyCar =
    monthlyInstalment + inputs.insurance + inputs.maintenance;
  const totalCarCost =
    totalMonthlyCar * months + inputs.carPrice * (inputs.deposit / 100);
  const carDepreciation = inputs.carPrice * (1 - Math.pow(0.85, inputs.years));
  const carValueRemaining = inputs.carPrice - carDepreciation;

  const monthlyInvest = totalMonthlyCar;
  const investmentValue =
    monthlyInvest * ((Math.pow(1 + 0.09 / 12, months) - 1) / (0.09 / 12));

  const investWins = investmentValue > carValueRemaining;

  const explainerSections = [
    {
      heading: "What this studio calculates",
      body: "This studio compares the five-year cost of financing a luxury vehicle against investing the equivalent monthly amount into a JSE ETF. The car scenario includes monthly instalments, insurance, and maintenance. The investment scenario compounds monthly contributions at a conservative market return.",
    },
    {
      heading: "Key assumptions",
      items: [
        "Vehicle finance instalments are calculated using the standard amortisation formula.",
        "Car depreciation is modelled at 15% per year — the South African average for new vehicles.",
        "Investment returns use 9% per year, reflecting a diversified JSE ETF portfolio.",
        "Insurance is set at R2 500/month for a luxury vehicle — typical for comprehensive cover in Gauteng.",
        "The investment figure reflects growth on monthly contributions over time, not a lump sum invested on day one.",
      ],
    },
    {
      heading: "Vehicle finance in South Africa",
      body: "South African vehicle finance is typically offered at prime plus 1–3%. The current prime rate is approximately 11.25%, putting most vehicle finance between 12.25% and 14.25%. Interest is front-loaded — in the early months of a finance agreement, most of your instalment pays interest rather than reducing the capital balance.",
    },
    {
      heading: "The depreciation reality",
      body: "A new R600 000 vehicle loses approximately R90 000 in value in its first year alone. By year five, the car is typically worth 40–50% of its purchase price. This depreciation is a real financial cost that does not appear on a monthly bank statement, which is why people routinely underestimate the true cost of vehicle ownership.",
    },
    {
      heading: "Why this matters for young professionals",
      body: "Vehicle finance is the single most common financial mistake made by young high-earning South Africans. The combination of a large loan at a high interest rate, rapid depreciation, and high insurance costs creates a monthly cash drain that compounds negatively over time — directly competing with investment contributions that would compound positively.",
    },
  ];

  return (
    <div className="studio">
      <div className="studio__layout">
        <div className="studio__inputs">
          <p className="studio__inputs-label">Your numbers</p>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Car purchase price</label>
              <span>{formatR(inputs.carPrice)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={2000000}
              step={10000}
              value={inputs.carPrice}
              onChange={(e) => update("carPrice", e.target.value)}
            />
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Deposit (%)</label>
              <span>{inputs.deposit}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={inputs.deposit}
              onChange={(e) => update("deposit", e.target.value)}
            />
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Interest rate (%)</label>
            </div>
            <input
              type="number"
              className="studio__number-input"
              min={8}
              max={25}
              step={0.25}
              value={inputs.interestRate}
              onChange={(e) => update("interestRate", e.target.value)}
            />
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Monthly insurance (R)</label>
            </div>
            <input
              type="number"
              className="studio__number-input"
              min={500}
              max={10000}
              step={100}
              value={inputs.insurance}
              onChange={(e) => update("insurance", e.target.value)}
            />
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Monthly maintenance (R)</label>
            </div>
            <input
              type="number"
              className="studio__number-input"
              min={0}
              max={5000}
              step={100}
              value={inputs.maintenance}
              onChange={(e) => update("maintenance", e.target.value)}
            />
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Time horizon</label>
              <span>{inputs.years} years</span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={inputs.years}
              onChange={(e) => update("years", e.target.value)}
            />
          </div>

          <div className="studio__sa-note">
            <p className="studio__sa-label">SA context applied</p>
            <ul className="studio__sa-list">
              <li>Vehicle depreciation: 15% per year</li>
              <li>ETF return: 9% per year (JSE average)</li>
              <li>Investment not inflation-adjusted</li>
            </ul>
          </div>
        </div>

        <div className="studio__outputs">
          <p className="studio__inputs-label">Results</p>

          <div className="studio__compare">
            <div className="studio__compare-card">
              <p className="studio__compare-label">Finance the car</p>
              <p className="studio__compare-value">{formatR(totalCarCost)}</p>
              <p className="studio__compare-sub">
                Total cost over {inputs.years} years
              </p>
              <div className="studio__compare-rows">
                <div className="studio__compare-row">
                  <span>Monthly instalment</span>
                  <span>{formatR(monthlyInstalment)}</span>
                </div>
                <div className="studio__compare-row">
                  <span>Insurance</span>
                  <span>{formatR(inputs.insurance)}/month</span>
                </div>
                <div className="studio__compare-row">
                  <span>Maintenance</span>
                  <span>{formatR(inputs.maintenance)}/month</span>
                </div>
                <div className="studio__compare-row studio__compare-row--highlight">
                  <span>Car value remaining</span>
                  <span>{formatR(carValueRemaining)}</span>
                </div>
              </div>
            </div>

            <div className="studio__compare-card">
              <p className="studio__compare-label">Invest the difference</p>
              <p className="studio__compare-value">
                {formatR(investmentValue)}
              </p>
              <p className="studio__compare-sub">
                Portfolio value after {inputs.years} years
              </p>
              <div className="studio__compare-rows">
                <div className="studio__compare-row">
                  <span>Monthly invested</span>
                  <span>{formatR(totalMonthlyCar)}</span>
                </div>
                <div className="studio__compare-row">
                  <span>Return rate</span>
                  <span>9% per year</span>
                </div>
                <div className="studio__compare-row studio__compare-row--highlight">
                  <span>Portfolio value</span>
                  <span>{formatR(investmentValue)}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`studio__verdict ${
              investWins ? "studio__verdict--rent" : "studio__verdict--buy"
            }`}
          >
            <p className="studio__verdict-label">Studio verdict</p>
            <p className="studio__verdict-title">
              {investWins
                ? "Investing the same amount grows significantly more."
                : "The car retains enough value to justify the cost."}
            </p>
            <p className="studio__verdict-body">
              {investWins
                ? `Financing this car costs ${formatR(totalCarCost)} over ${
                    inputs.years
                  } years, leaving a car worth ${formatR(
                    carValueRemaining
                  )}. Investing the same monthly amount grows to ${formatR(
                    investmentValue
                  )} — a difference of ${formatR(
                    investmentValue - carValueRemaining
                  )}. The investment figure reflects growth on contributions made over time, not a lump sum.`
                : `The car retains ${formatR(
                    carValueRemaining
                  )} in value after depreciation. Your total cost is ${formatR(
                    totalCarCost
                  )}. If the car is essential for your lifestyle and career, the cost may be justified — but understand what compounding you are giving up.`}
            </p>
          </div>
        </div>
      </div>
      <StudioExplainer
        title="Luxury Car vs. Invest"
        sections={explainerSections}
      />
    </div>
  );
}
