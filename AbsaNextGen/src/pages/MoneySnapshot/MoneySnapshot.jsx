import { currentUser } from "../../data/userData";
import "./MoneySnapshot.css";

function MetricTile({ label, value, sub }) {
  return (
    <div className="metric-tile">
      <span className="metric-tile__label">{label}</span>
      <span className="metric-tile__value">
        R {value.toLocaleString("en-ZA")}
      </span>
      <span className="metric-tile__sub">{sub}</span>
    </div>
  );
}

function NudgeCard({ type, title, body }) {
  return (
    <div className={`nudge-card nudge-card--${type}`}>
      <p className="nudge-card__title">{title}</p>
      <p className="nudge-card__body">{body}</p>
    </div>
  );
}

function GoalCard({ name, current, target }) {
  const percent = Math.round((current / target) * 100);
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

export default function MoneySnapshot() {
  const {
    name,
    initials,
    track,
    grossSalary,
    paye,
    takeHome,
    spending,
    breakdown,
    saContext,
    goals,
    nudges,
    trend,
  } = currentUser;

  const totalBreakdown = breakdown.reduce((sum, item) => sum + item.amount, 0);

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
          <p className="snapshot__track">{track} track</p>
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
        </div>
      </div>

      <section className="snapshot__section">
        <p className="snapshot__section-label">This month at a glance</p>
        <div className="snapshot__tiles">
          <MetricTile
            label="Fixed costs"
            value={spending.fixedCosts}
            sub={`${Math.round(
              (spending.fixedCosts / takeHome) * 100
            )}% of take-home`}
          />
          <MetricTile
            label="Discretionary"
            value={spending.discretionary}
            sub={`${Math.round(
              (spending.discretionary / takeHome) * 100
            )}% of take-home`}
          />
          <MetricTile
            label="Saved / invested"
            value={spending.savedInvested}
            sub={`${Math.round(
              (spending.savedInvested / takeHome) * 100
            )}% of take-home`}
          />
          <MetricTile
            label="Invisible costs"
            value={spending.invisibleCosts}
            sub="Fees + interest"
          />
        </div>
      </section>

      <div className="snapshot__two-col">
        <div className="snapshot__col">
          <section className="snapshot__section snapshot__card">
            <p className="snapshot__section-label">Spending breakdown</p>
            <div className="snapshot__bar">
              {breakdown.map((item) => (
                <div
                  key={item.label}
                  className="snapshot__bar-segment"
                  style={{
                    flex: item.amount / totalBreakdown,
                    background: item.color,
                  }}
                  title={item.label}
                />
              ))}
            </div>
            <div className="snapshot__legend">
              {breakdown.map((item) => (
                <div key={item.label} className="snapshot__legend-row">
                  <div className="snapshot__legend-left">
                    <span
                      className="snapshot__legend-dot"
                      style={{ background: item.color }}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className="snapshot__legend-amount">
                    R {item.amount.toLocaleString("en-ZA")}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="snapshot__section">
            <p className="snapshot__section-label">Nudges</p>
            <div className="snapshot__nudges">
              {nudges.map((nudge) => (
                <NudgeCard key={nudge.id} {...nudge} />
              ))}
            </div>
          </section>
        </div>

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
                stroke="var(--color-text-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={expensePoints}
                fill="none"
                stroke="var(--color-text-muted)"
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

          <section className="snapshot__section">
            <p className="snapshot__section-label">Goals</p>
            <div className="snapshot__goals">
              {goals.map((goal) => (
                <GoalCard key={goal.id} {...goal} />
              ))}
            </div>
          </section>

          <section className="snapshot__section snapshot__card">
            <p className="snapshot__section-label">SA context</p>
            <div className="snapshot__sa-rows">
              <div className="snapshot__sa-row">
                <span>Medical aid ({saContext.medicalAidName})</span>
                <span>R {saContext.medicalAid.toLocaleString("en-ZA")}</span>
              </div>
              <div className="snapshot__sa-row">
                <span>RA / provident contribution</span>
                <span>
                  R {saContext.raContribution.toLocaleString("en-ZA")}
                </span>
              </div>
              <div className="snapshot__sa-row">
                <span>Bank charges</span>
                <span>R {saContext.bankCharges.toLocaleString("en-ZA")}</span>
              </div>
              <div className="snapshot__sa-row">
                <span>Credit card interest</span>
                <span>
                  R {saContext.creditCardInterest.toLocaleString("en-ZA")}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
