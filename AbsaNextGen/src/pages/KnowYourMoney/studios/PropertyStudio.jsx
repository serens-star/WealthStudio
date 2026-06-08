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

export default function PropertyStudio() {
  const [inputs, setInputs] = useState({
    salary: 45000,
    propertyPrice: 1200000,
    deposit: 10,
    interestRate: 11,
    rentalCost: 12000,
    years: 5,
  });

  const update = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const depositAmount = safeNum(inputs.propertyPrice * (inputs.deposit / 100));
  const loanAmount = safeNum(inputs.propertyPrice - depositAmount);
  const monthlyRate = safeNum(inputs.interestRate / 100 / 12);
  const months = safeNum(inputs.years * 12, 60);
  const monthlyBond =
    monthlyRate > 0
      ? safeNum(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1)
        )
      : safeNum(loanAmount / months);

  const levy = 2200;
  const insurance = 800;
  const totalMonthlyBuy = safeNum(monthlyBond + levy + insurance);
  const transferDuty = safeNum(
    (() => {
      const p = inputs.propertyPrice;
      if (p <= 1100000) return 0;
      if (p <= 1512000) return (p - 1100000) * 0.03;
      if (p <= 2117000) return 12360 + (p - 1512000) * 0.06;
      if (p <= 2722000) return 48600 + (p - 2117000) * 0.08;
      if (p <= 12100000) return 97040 + (p - 2722000) * 0.11;
      return 1128600 + (p - 12100000) * 0.13;
    })()
  );
  const totalBuyCost = safeNum(
    totalMonthlyBuy * months + depositAmount + transferDuty
  );
  const totalRentCost = safeNum(inputs.rentalCost * months);
  const monthlyInvest = safeNum(totalMonthlyBuy - inputs.rentalCost);
  const investmentGrowth =
    monthlyInvest > 0
      ? safeNum(
          monthlyInvest * ((Math.pow(1 + 0.09 / 12, months) - 1) / (0.09 / 12))
        )
      : 0;

  const equityBuilt = safeNum(
    inputs.propertyPrice * Math.pow(1.05, inputs.years) - loanAmount
  );

  const buyingWins = equityBuilt > investmentGrowth;

  const explainerSections = [
    {
      heading: "What this studio calculates",
      body: "This studio compares the true five-year cost of buying a property versus renting and investing the difference. It accounts for bond repayments, transfer duty, levies, insurance, and equity built — against rental payments and the growth of invested savings.",
    },
    {
      heading: "Key assumptions",
      items: [
        "Bond repayments are calculated using the standard amortisation formula at your chosen interest rate.",
        "Property appreciation is modelled at 5% per year — the long-run average for South African residential property.",
        "The investment return on renting scenarios uses 9% per year — a conservative JSE ETF estimate.",
        "Levies are estimated at R2 200/month, typical for a Joburg sectional title property.",
        "Home insurance is estimated at R800/month.",
      ],
    },
    {
      heading: "Transfer duty in South Africa",
      body: "Transfer duty is a tax paid to SARS when purchasing property. Properties below R1.1 million are exempt. Between R1.1M and R1.512M, the rate is 3% on the amount above R1.1M. This cost is paid once at registration and is not recoverable — it is a real upfront cost of buying.",
    },
    {
      heading: "Why the verdict can favour renting",
      body: "Many South Africans assume buying always wins. But over short horizons — typically under 7 years — the upfront costs of buying (deposit, transfer duty, bond registration) combined with slower equity accumulation in the early years often means renting and investing the difference produces more liquid wealth. The property advantage compounds over longer periods.",
    },
    {
      heading: "What this studio does not account for",
      body: "This is a simplified model. It does not include bond registration fees (approximately 1–2% of bond value), conveyancing fees, or the psychological value of ownership. It also assumes rental prices remain constant, which understates the renting cost over time.",
    },
  ];

  return (
    <div className="studio">
      <div className="studio__layout">
        <div className="studio__inputs">
          <p className="studio__inputs-label">Your numbers</p>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Monthly salary (gross)</label>
              <span>{formatR(inputs.salary)}</span>
            </div>
            <input
              type="range"
              min={20000}
              max={100000}
              step={1000}
              value={inputs.salary}
              onChange={(e) => update("salary", e.target.value)}
            />
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Property price</label>
              <span>{formatR(inputs.propertyPrice)}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={5000000}
              step={50000}
              value={inputs.propertyPrice}
              onChange={(e) => update("propertyPrice", e.target.value)}
            />
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Deposit (%)</label>
              <span>{inputs.deposit}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
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
              min={7}
              max={20}
              step={0.25}
              value={inputs.interestRate}
              onChange={(e) => update("interestRate", e.target.value)}
            />
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Monthly rental alternative</label>
            </div>
            <input
              type="number"
              className="studio__number-input"
              min={5000}
              max={50000}
              step={500}
              value={inputs.rentalCost}
              onChange={(e) => update("rentalCost", e.target.value)}
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
              max={10}
              step={1}
              value={inputs.years}
              onChange={(e) => update("years", e.target.value)}
            />
          </div>

          <div className="studio__sa-note">
            <p className="studio__sa-label">SA context applied</p>
            <ul className="studio__sa-list">
              <li>Transfer duty: {formatR(transferDuty)}</li>
              <li>Levy estimate: R 2 200/month</li>
              <li>Home insurance: R 800/month</li>
              <li>Property appreciation: 5% per year</li>
            </ul>
          </div>
        </div>

        <div className="studio__outputs">
          <p className="studio__inputs-label">Results</p>

          <div className="studio__compare">
            <div className="studio__compare-card">
              <p className="studio__compare-label">If you buy</p>
              <p className="studio__compare-value">{formatR(totalBuyCost)}</p>
              <p className="studio__compare-sub">
                Total cost over {inputs.years} years
              </p>
              <div className="studio__compare-rows">
                <div className="studio__compare-row">
                  <span>Monthly bond</span>
                  <span>{formatR(monthlyBond)}</span>
                </div>
                <div className="studio__compare-row">
                  <span>Levy + insurance</span>
                  <span>{formatR(levy + insurance)}/month</span>
                </div>
                <div className="studio__compare-row">
                  <span>Deposit paid</span>
                  <span>{formatR(depositAmount)}</span>
                </div>
                <div className="studio__compare-row">
                  <span>Transfer duty</span>
                  <span>{formatR(transferDuty)}</span>
                </div>
                <div className="studio__compare-row studio__compare-row--highlight">
                  <span>Equity built</span>
                  <span>{formatR(equityBuilt)}</span>
                </div>
              </div>
            </div>

            <div className="studio__compare-card">
              <p className="studio__compare-label">If you rent + invest</p>
              <p className="studio__compare-value">{formatR(totalRentCost)}</p>
              <p className="studio__compare-sub">
                Total rent over {inputs.years} years
              </p>
              <div className="studio__compare-rows">
                <div className="studio__compare-row">
                  <span>Monthly rent</span>
                  <span>{formatR(inputs.rentalCost)}</span>
                </div>
                <div className="studio__compare-row">
                  <span>Monthly invested</span>
                  <span>{formatR(Math.max(0, monthlyInvest))}</span>
                </div>
                <div className="studio__compare-row studio__compare-row--highlight">
                  <span>Investment value</span>
                  <span>{formatR(investmentGrowth)}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`studio__verdict ${
              buyingWins ? "studio__verdict--buy" : "studio__verdict--rent"
            }`}
          >
            <p className="studio__verdict-label">Studio verdict</p>
            <p className="studio__verdict-title">
              {buyingWins
                ? "Buying builds more wealth over this horizon."
                : "Renting and investing comes out ahead."}
            </p>
            <p className="studio__verdict-body">
              {buyingWins
                ? `After ${inputs.years} years, buying builds ${formatR(
                    equityBuilt
                  )} in equity. Renting and investing the difference grows to ${formatR(
                    investmentGrowth
                  )}. The property wins — but only if you stay long enough for appreciation to compound.`
                : `After ${
                    inputs.years
                  } years, renting and investing the ${formatR(
                    monthlyInvest
                  )} monthly difference grows to ${formatR(
                    investmentGrowth
                  )} in liquid assets. Your equity from buying would be ${formatR(
                    equityBuilt
                  )}. At this time horizon, flexibility wins.`}
            </p>
          </div>
        </div>
      </div>
      <StudioExplainer
        title="Property vs. Renting"
        sections={explainerSections}
      />
    </div>
  );
}
