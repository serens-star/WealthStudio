import { useState } from "react";
import { useUser } from "../../context/UserContext";
import "./MoneySnapshot.css";

function Tooltip({ text }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="tooltip-wrapper">
      <button
        className="tooltip-trigger"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
        aria-label="More information"
      >
        ?
      </button>
      {visible && <span className="tooltip-box">{text}</span>}
    </span>
  );
}

function HealthScore({ score }) {
  const label =
    score >= 80
      ? "Excellent"
      : score >= 60
      ? "Good"
      : score >= 40
      ? "Fair"
      : "Needs attention";

  const color =
    score >= 80
      ? "#3db87a"
      : score >= 60
      ? "#8586fe"
      : score >= 40
      ? "#e8a838"
      : "#a50000";

  return (
    <div className="health-score">
      <div className="health-score__left">
        <p className="health-score__label">
          Financial health score
          <Tooltip text="A score from 0–100 based on your savings rate, debt-to-income ratio, emergency fund coverage, and investment contributions. Higher is better." />
        </p>
        <p className="health-score__status" style={{ color }}>
          {label}
        </p>
      </div>
      <div className="health-score__right">
        <div className="health-score__ring">
          <svg viewBox="0 0 60 60" width="60" height="60">
            <circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="5"
            />
            <circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeDasharray={`${(score / 100) * 150.8} 150.8`}
              strokeLinecap="round"
              transform="rotate(-90 30 30)"
            />
          </svg>
          <span className="health-score__number">{score}</span>
        </div>
      </div>
    </div>
  );
}

function MetricTile({ label, value, sub, tooltip, highlight }) {
  return (
    <div className={`metric-tile ${highlight ? "metric-tile--highlight" : ""}`}>
      <span className="metric-tile__label">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </span>
      <span className="metric-tile__value">{value}</span>
      <span className="metric-tile__sub">{sub}</span>
    </div>
  );
}

function NudgeCard({ nudge, onDismiss }) {
  return (
    <div className={`nudge-card nudge-card--${nudge.type}`}>
      <div className="nudge-card__content">
        <p className="nudge-card__title">{nudge.title}</p>
        <p className="nudge-card__body">{nudge.body}</p>
      </div>
      <button
        className="nudge-card__dismiss"
        onClick={() => onDismiss(nudge.id)}
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

function GoalCard({ name, current, target }) {
  const percent = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="goal-card">
      <div className="goal-card__header">
        <span className="goal-card__name">{name}</span>
        <span className="goal-card__amounts">
          R {current.toLocaleString("en-ZA")} / R{" "}
          {target.toLocaleString("en-ZA")}
        </span>
      </div>
      <div className="goal-card__track">
        <div className="goal-card__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="goal-card__percent">{percent}%</span>
    </div>
  );
}

function CategoryBar({ categories, total }) {
  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="category-bar__segment"
          style={{
            flex: cat.amount / total,
            background: cat.color,
          }}
          title={`${cat.label}: R ${cat.amount.toLocaleString("en-ZA")}`}
        />
      ))}
    </div>
  );
}

function generateNarrative(takeHome, categories, dti, savingsRate) {
  const housing = categories.find((c) => c.id === "housing");
  const lifestyle = categories.find((c) => c.id === "lifestyle");
  const housingPct = Math.round((housing?.amount / takeHome) * 100);
  const lifestylePct = Math.round((lifestyle?.amount / takeHome) * 100);

  const lines = [];

  if (housingPct > 35) {
    lines.push(
      `Your housing costs are ${housingPct}% of take-home — above the recommended 30%. Consider whether your current living arrangement is sustainable long-term.`
    );
  } else {
    lines.push(
      `Your housing costs are ${housingPct}% of take-home, which is within a healthy range for your income band.`
    );
  }

  if (lifestylePct > 25) {
    lines.push(
      `Lifestyle spending is at ${lifestylePct}% — watch for creep here as income rises.`
    );
  }

  if (savingsRate < 10) {
    lines.push(
      `Your savings rate of ${savingsRate}% is below the recommended 15–20% for wealth-building in your first five years.`
    );
  } else {
    lines.push(
      `You're saving ${savingsRate}% of take-home — a solid foundation for your first five years.`
    );
  }

  if (dti > 35) {
    lines.push(
      `Your debt-to-income ratio of ${dti}% is elevated. Prioritise debt reduction to free up cash flow.`
    );
  }

  return lines;
}

export default function MoneySnapshot() {
  const { user, removeNudge } = useUser();

  const {
    name,
    initials,
    track,
    grossSalary,
    paye,
    takeHome,
    categories = [],
    saContext,
    goals,
    nudges,
    trend,
    debts = {},
    spending,
  } = user;

  const totalCategories = categories.reduce((s, c) => s + c.amount, 0);

  const totalDebt = Object.values(debts).reduce((s, v) => s + v, 0);
  const monthlyDebtRepayments =
    user.categories?.find((c) => c.id === "debt")?.amount || 0;
  const dti = Math.round((monthlyDebtRepayments / takeHome) * 100);
  const savingsRate = Math.round(
    ((spending?.savedInvested || 0) / takeHome) * 100
  );
  const disposableIncome =
    takeHome -
    totalCategories +
    (categories.find((c) => c.id === "savings")?.amount || 0);
  const emergencyMonths =
    Math.round(
      ((goals.find((g) => g.name.toLowerCase().includes("emergency"))
        ?.current || 0) /
        (takeHome / 3)) *
        10
    ) / 10;

  const healthScore = Math.min(
    100,
    Math.max(
      0,
      (savingsRate >= 15 ? 25 : Math.round((savingsRate / 15) * 25)) +
        (dti <= 8 ? 25 : Math.max(0, 25 - (dti - 8) * 2)) +
        (emergencyMonths >= 3 ? 25 : Math.round((emergencyMonths / 3) * 25)) +
        (saContext.raContribution > 0 ? 25 : 0)
    )
  );

  const narratives = generateNarrative(takeHome, categories, dti, savingsRate);

  const incomePoints = trend.income
    .map((v, i) => {
      const x = Math.round((i / (trend.months.length - 1)) * 280);
      const y = Math.round(60 - ((v - 28000) / 6000) * 48);
      return `${x},${y}`;
    })
    .join(" ");

  const expensePoints = trend.expenses
    .map((v, i) => {
      const x = Math.round((i / (trend.months.length - 1)) * 280);
      const y = Math.round(60 - ((v - 28000) / 6000) * 48);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="snapshot">
      <div className="snapshot__header">
        <div className="snapshot__header-left">
          <p className="snapshot__greeting">Good morning</p>
          <h1 className="snapshot__name">{name}</h1>
          <span className="snapshot__track">{track} track</span>
        </div>
        <div className="snapshot__avatar">{initials}</div>
      </div>

      <div className="snapshot__salary-card">
        <div className="snapshot__salary-main">
          <p className="snapshot__salary-label">Take-home this month</p>
          <p className="snapshot__salary-value">
            R {takeHome.toLocaleString("en-ZA")}
          </p>
        </div>
        <div className="snapshot__salary-meta">
          <div className="snapshot__salary-row">
            <span>Gross salary</span>
            <span>R {grossSalary.toLocaleString("en-ZA")}</span>
          </div>
          <div className="snapshot__salary-row">
            <span>PAYE deducted</span>
            <span>− R {paye.toLocaleString("en-ZA")}</span>
          </div>
          <div className="snapshot__salary-row">
            <span>Medical aid</span>
            <span>− R {saContext.medicalAid.toLocaleString("en-ZA")}</span>
          </div>
          <div className="snapshot__salary-row">
            <span>RA contribution</span>
            <span>− R {saContext.raContribution.toLocaleString("en-ZA")}</span>
          </div>
        </div>
        <HealthScore score={healthScore} />
      </div>

      <section className="snapshot__section">
        <p className="snapshot__section-label">Key financial metrics</p>
        <div className="snapshot__tiles">
          <MetricTile
            label="Debt-to-income ratio"
            value={`${dti}%`}
            sub={dti > 35 ? "Above safe range" : "Within healthy range"}
            tooltip="Your monthly debt repayments as a percentage of take-home pay. Keep this below 35% to maintain financial flexibility."
            highlight={dti > 35}
          />
          <MetricTile
            label="Savings rate"
            value={`${savingsRate}%`}
            sub={savingsRate >= 15 ? "On track" : "Below 15% target"}
            tooltip="The percentage of your take-home pay that goes toward savings and investments each month. Aim for 15–20% in your first five years."
            highlight={savingsRate < 10}
          />
          <MetricTile
            label="Disposable income"
            value={`R ${Math.max(0, disposableIncome).toLocaleString("en-ZA")}`}
            sub="After all categories"
            tooltip="What remains after all spending categories are accounted for. This is your buffer — keep it positive."
          />
          <MetricTile
            label="Emergency fund"
            value={`${emergencyMonths} months`}
            sub={emergencyMonths >= 3 ? "Target met" : `Target: 3 months`}
            tooltip="How many months of expenses your emergency fund covers. Aim for 3–6 months before investing aggressively."
            highlight={emergencyMonths < 1}
          />
        </div>
      </section>

      {narratives.length > 0 && (
        <section className="snapshot__narratives">
          <p className="snapshot__section-label">Your financial snapshot</p>
          <div className="snapshot__narrative-list">
            {narratives.map((line, i) => (
              <div key={i} className="snapshot__narrative-item">
                <span className="snapshot__narrative-dot" />
                <p>{line}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="snapshot__section">
        <p className="snapshot__section-label">Spending categories</p>
        <div className="snapshot__card">
          <CategoryBar categories={categories} total={totalCategories} />
          <div className="snapshot__categories">
            {categories.map((cat) => (
              <div key={cat.id} className="snapshot__category-row">
                <div className="snapshot__category-left">
                  <span
                    className="snapshot__category-dot"
                    style={{ background: cat.color }}
                  />
                  <div>
                    <span className="snapshot__category-label">
                      {cat.label}
                    </span>
                    <span className="snapshot__category-desc">
                      {cat.description}
                    </span>
                  </div>
                </div>
                <div className="snapshot__category-right">
                  <span className="snapshot__category-amount">
                    R {cat.amount.toLocaleString("en-ZA")}
                  </span>
                  <span className="snapshot__category-pct">
                    {Math.round((cat.amount / takeHome) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="snapshot__two-col">
        <div className="snapshot__col">
          <section className="snapshot__section snapshot__card">
            <p className="snapshot__section-label">Expense trend — 6 months</p>
            <p className="snapshot__trend-note">Income vs. expenses</p>
            <svg
              className="snapshot__trend-svg"
              viewBox="0 0 280 70"
              width="100%"
              aria-label="Income vs expenses over 6 months"
            >
              <line
                x1="0"
                y1="60"
                x2="280"
                y2="60"
                stroke="var(--color-border)"
                strokeWidth="0.5"
              />
              <polyline
                points={incomePoints}
                fill="none"
                stroke="var(--color-absa)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={expensePoints}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {trend.months.map((m, i) => (
                <text
                  key={m}
                  x={Math.round((i / (trend.months.length - 1)) * 270)}
                  y="70"
                  className="snapshot__trend-label"
                >
                  {m}
                </text>
              ))}
            </svg>
            <div className="snapshot__trend-legend">
              <div className="snapshot__trend-key">
                <div className="snapshot__trend-line snapshot__trend-line--solid" />
                <span>Income</span>
              </div>
              <div className="snapshot__trend-key">
                <div className="snapshot__trend-line snapshot__trend-line--dashed" />
                <span>Expenses</span>
              </div>
            </div>
          </section>

          <section className="snapshot__section snapshot__card">
            <p className="snapshot__section-label">SA context</p>
            <div className="snapshot__sa-rows">
              <div className="snapshot__sa-row">
                <span>
                  Medical aid
                  <Tooltip text="Medical aid contributions qualify for a monthly tax credit of R364 for the primary member under SARS rules." />
                </span>
                <span>R {saContext.medicalAid.toLocaleString("en-ZA")}/mo</span>
              </div>
              <div className="snapshot__sa-row">
                <span>
                  RA contribution
                  <Tooltip text="Retirement Annuity contributions are tax-deductible up to 27.5% of taxable income (max R350 000/year) under SARS." />
                </span>
                <span>
                  R {saContext.raContribution.toLocaleString("en-ZA")}/mo
                </span>
              </div>
              <div className="snapshot__sa-row">
                <span>Bank charges</span>
                <span>
                  R {saContext.bankCharges.toLocaleString("en-ZA")}/mo
                </span>
              </div>
              <div className="snapshot__sa-row">
                <span>
                  Credit card interest
                  <Tooltip text="Credit card interest in South Africa typically ranges from 15–22% per year. Clearing your balance monthly eliminates this cost entirely." />
                </span>
                <span>
                  R {saContext.creditCardInterest.toLocaleString("en-ZA")}/mo
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="snapshot__col">
          {nudges.length > 0 && (
            <section className="snapshot__section">
              <p className="snapshot__section-label">Nudges</p>
              <div className="snapshot__nudges">
                {nudges.map((nudge) => (
                  <NudgeCard
                    key={nudge.id}
                    nudge={nudge}
                    onDismiss={removeNudge}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="snapshot__section">
            <p className="snapshot__section-label">Goals</p>
            <div className="snapshot__goals">
              {goals.map((goal) => (
                <GoalCard key={goal.id} {...goal} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
