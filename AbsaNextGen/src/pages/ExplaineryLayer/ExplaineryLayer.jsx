import { useState } from "react";
import { useUser } from "../../context/UserContext";
import "./ExplaineryLayer.css";

function CompoundCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(10);

  const result = principal * Math.pow(1 + rate / 100, years);
  const gained = result - principal;

  return (
    <div className="learn-explainer">
      <p className="learn-explainer__title">Compound interest calculator</p>
      <p className="learn-explainer__desc">
        See why time in the market matters more than timing the market. The
        longer you invest, the more your returns earn their own returns.
      </p>
      <div className="learn-explainer__controls">
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Starting amount</label>
            <span>R {principal.toLocaleString("en-ZA")}</span>
          </div>
          <input
            type="range"
            min={1000}
            max={500000}
            step={1000}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
          />
        </div>
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Annual return</label>
            <span>{rate}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </div>
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Years invested</label>
            <span>{years} years</span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="learn-explainer__result">
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">Final value</span>
          <span className="learn-explainer__result-value">
            R {Math.round(result).toLocaleString("en-ZA")}
          </span>
        </div>
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">Interest earned</span>
          <span className="learn-explainer__result-value learn-explainer__result-value--positive">
            + R {Math.round(gained).toLocaleString("en-ZA")}
          </span>
        </div>
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">
            Return on investment
          </span>
          <span className="learn-explainer__result-value">
            {Math.round((gained / principal) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function PAYECalculator() {
  const [gross, setGross] = useState(45000);

  const annual = gross * 12;
  let tax = 0;
  if (annual <= 237100) tax = annual * 0.18;
  else if (annual <= 370500) tax = 42678 + (annual - 237100) * 0.26;
  else if (annual <= 512800) tax = 77362 + (annual - 370500) * 0.31;
  else if (annual <= 673000) tax = 121475 + (annual - 512800) * 0.36;
  else if (annual <= 857900) tax = 179147 + (annual - 673000) * 0.39;
  else if (annual <= 1817000) tax = 251258 + (annual - 857900) * 0.41;
  else tax = 644489 + (annual - 1817000) * 0.45;

  const rebate = 17235;
  const annualTax = Math.max(0, tax - rebate);
  const monthlyTax = Math.round(annualTax / 12);
  const takeHome = gross - monthlyTax;
  const effectiveRate = Math.round((annualTax / annual) * 100);

  return (
    <div className="learn-explainer">
      <p className="learn-explainer__title">PAYE tax estimator</p>
      <p className="learn-explainer__desc">
        PAYE stands for Pay As You Earn. Your employer deducts it from your
        salary every month before you receive it. This uses the 2024/25 SARS tax
        tables.
      </p>
      <div className="learn-explainer__controls">
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Monthly gross salary</label>
            <span>R {gross.toLocaleString("en-ZA")}</span>
          </div>
          <input
            type="range"
            min={5000}
            max={150000}
            step={1000}
            value={gross}
            onChange={(e) => setGross(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="learn-explainer__result">
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">Monthly PAYE</span>
          <span className="learn-explainer__result-value learn-explainer__result-value--negative">
            − R {monthlyTax.toLocaleString("en-ZA")}
          </span>
        </div>
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">Take-home pay</span>
          <span className="learn-explainer__result-value">
            R {takeHome.toLocaleString("en-ZA")}
          </span>
        </div>
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">
            Effective tax rate
          </span>
          <span className="learn-explainer__result-value">
            {effectiveRate}%
          </span>
        </div>
      </div>
      <p className="learn-explainer__footnote">
        This is an estimate. Your actual PAYE may differ based on deductions,
        medical aid credits, and RA contributions.
      </p>
    </div>
  );
}

function RACalculator() {
  const [monthly, setMonthly] = useState(2000);
  const [gross, setGross] = useState(45000);
  const [years, setYears] = useState(5);

  const annualRA = monthly * 12;
  const annualGross = gross * 12;
  const deductionLimit = Math.min(annualRA, annualGross * 0.275, 350000);
  const taxSaving = deductionLimit * 0.31;
  const monthlySaving = Math.round(taxSaving / 12);
  const portfolioValue =
    monthly * ((Math.pow(1 + 0.09 / 12, years * 12) - 1) / (0.09 / 12));

  return (
    <div className="learn-explainer">
      <p className="learn-explainer__title">Retirement annuity (RA) benefit</p>
      <p className="learn-explainer__desc">
        An RA lets you invest for retirement and claim your contributions as a
        tax deduction. SARS allows up to 27.5% of your taxable income, capped at
        R350 000 per year. The money grows tax-free inside the fund.
      </p>
      <div className="learn-explainer__controls">
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Monthly RA contribution</label>
            <span>R {monthly.toLocaleString("en-ZA")}</span>
          </div>
          <input
            type="range"
            min={500}
            max={20000}
            step={250}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
          />
        </div>
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Monthly gross salary</label>
            <span>R {gross.toLocaleString("en-ZA")}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={150000}
            step={1000}
            value={gross}
            onChange={(e) => setGross(Number(e.target.value))}
          />
        </div>
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Years contributing</label>
            <span>{years} years</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="learn-explainer__result">
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">
            Monthly tax saving
          </span>
          <span className="learn-explainer__result-value learn-explainer__result-value--positive">
            R {monthlySaving.toLocaleString("en-ZA")}/mo
          </span>
        </div>
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">
            Portfolio value after {years} years
          </span>
          <span className="learn-explainer__result-value">
            R {Math.round(portfolioValue).toLocaleString("en-ZA")}
          </span>
        </div>
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">
            Annual deduction applied
          </span>
          <span className="learn-explainer__result-value">
            R {Math.round(deductionLimit).toLocaleString("en-ZA")}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmergencyFundCalculator() {
  const [monthly, setMonthly] = useState(33000);
  const [months, setMonths] = useState(3);
  const [saved, setSaved] = useState(5000);

  const target = monthly * months;
  const remaining = Math.max(0, target - saved);
  const percent = Math.min(100, Math.round((saved / target) * 100));

  return (
    <div className="learn-explainer">
      <p className="learn-explainer__title">Emergency fund tracker</p>
      <p className="learn-explainer__desc">
        An emergency fund is 3 to 6 months of living expenses kept in a liquid
        account — not invested. It protects you from having to take on debt when
        something unexpected happens.
      </p>
      <div className="learn-explainer__controls">
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Monthly expenses</label>
            <span>R {monthly.toLocaleString("en-ZA")}</span>
          </div>
          <input
            type="range"
            min={5000}
            max={100000}
            step={1000}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
          />
        </div>
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Target months of cover</label>
            <span>{months} months</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
        </div>
        <div className="learn-explainer__field">
          <div className="learn-explainer__field-header">
            <label>Amount saved so far</label>
            <span>R {saved.toLocaleString("en-ZA")}</span>
          </div>
          <input
            type="range"
            min={0}
            max={500000}
            step={1000}
            value={saved}
            onChange={(e) => setSaved(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="learn-explainer__progress">
        <div className="learn-explainer__progress-header">
          <span>{percent}% of target</span>
          <span>
            R {saved.toLocaleString("en-ZA")} / R{" "}
            {target.toLocaleString("en-ZA")}
          </span>
        </div>
        <div className="learn-explainer__progress-track">
          <div
            className="learn-explainer__progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="learn-explainer__result">
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">Target amount</span>
          <span className="learn-explainer__result-value">
            R {target.toLocaleString("en-ZA")}
          </span>
        </div>
        <div className="learn-explainer__result-item">
          <span className="learn-explainer__result-label">Still needed</span>
          <span className="learn-explainer__result-value">
            R {remaining.toLocaleString("en-ZA")}
          </span>
        </div>
      </div>
    </div>
  );
}

const glossaryTerms = [
  {
    term: "ETF",
    definition:
      "Exchange-Traded Fund. A basket of stocks or bonds that trades on a stock exchange like a single share. Lower cost than most unit trusts.",
  },
  {
    term: "TFSA",
    definition:
      "Tax-Free Savings Account. You can invest up to R36 000 per year and R500 000 in your lifetime with no tax on growth or withdrawals.",
  },
  {
    term: "RA",
    definition:
      "Retirement Annuity. A retirement savings vehicle with a tax deduction on contributions. You cannot access the money before age 55.",
  },
  {
    term: "GEPF",
    definition:
      "Government Employees Pension Fund. The pension fund for South African public sector employees. Contributions are 7.5% of pensionable salary.",
  },
  {
    term: "PAYE",
    definition:
      "Pay As You Earn. The tax your employer deducts from your salary each month and pays directly to SARS on your behalf.",
  },
  {
    term: "Transfer duty",
    definition:
      "A tax paid to SARS when buying property. Properties below R1.1 million are exempt. Between R1.1M and R1.512M, the rate is 3%.",
  },
  {
    term: "Prime rate",
    definition:
      "The benchmark interest rate set by major banks. Vehicle finance and home loans are typically quoted as prime plus or minus a percentage.",
  },
  {
    term: "JSE",
    definition:
      "Johannesburg Stock Exchange. South Africa's main stock exchange. The JSE All Share Index has returned approximately 8% per year historically.",
  },
  {
    term: "Compound interest",
    definition:
      "Earning returns on your returns. The longer your money is invested, the more your interest earns its own interest — this is why starting early matters.",
  },
  {
    term: "Lifestyle creep",
    definition:
      "The gradual increase in spending as income rises, often unconsciously. Expenses grow to match income, making it harder to save.",
  },
];

const explainers = [
  {
    id: "compound",
    label: "Compound interest",
    component: <CompoundCalculator />,
  },
  { id: "paye", label: "PAYE tax estimator", component: <PAYECalculator /> },
  { id: "ra", label: "Retirement annuity", component: <RACalculator /> },
  {
    id: "emergency",
    label: "Emergency fund",
    component: <EmergencyFundCalculator />,
  },
];

export default function ExplaineryLayer() {
  const [activeExplainer, setActiveExplainer] = useState("compound");
  const [glossaryOpen, setGlossaryOpen] = useState(null);

  return (
    <div className="learn">
      <div className="learn__header">
        <h1 className="learn__title">Learn</h1>
        <p className="learn__sub">
          Interactive explainers and plain-English guides to the financial
          concepts that matter most in your first five years.
        </p>
      </div>

      <section className="learn__section">
        <p className="learn__section-label">Interactive explainers</p>
        <div className="learn__tabs">
          {explainers.map((e) => (
            <button
              key={e.id}
              className={`learn__tab ${
                activeExplainer === e.id ? "learn__tab--active" : ""
              }`}
              onClick={() => setActiveExplainer(e.id)}
            >
              {e.label}
            </button>
          ))}
        </div>
        <div className="learn__explainer-panel">
          {explainers.find((e) => e.id === activeExplainer)?.component}
        </div>
      </section>

      <section className="learn__section">
        <p className="learn__section-label">SA finance glossary</p>
        <div className="learn__glossary">
          {glossaryTerms.map((item) => (
            <div key={item.term} className="learn__glossary-item">
              <button
                className="learn__glossary-term"
                onClick={() =>
                  setGlossaryOpen(glossaryOpen === item.term ? null : item.term)
                }
              >
                <span>{item.term}</span>
                <span className="learn__glossary-chevron">
                  {glossaryOpen === item.term ? "−" : "+"}
                </span>
              </button>
              {glossaryOpen === item.term && (
                <p className="learn__glossary-def">{item.definition}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
