import { useState } from "react";
import "./ExplaineryLayer.css";

const glossary = [
  {
    id: "emergency-fund",
    term: "Emergency Fund",
    short: "3–6 months of expenses saved in a liquid account.",
    full: "An emergency fund is money set aside to cover unexpected expenses — job loss, medical bills, car repairs — without going into debt. In South Africa, most financial advisors recommend 3 to 6 months of take-home pay held in a money market or savings account where it earns interest but stays accessible. Without one, a single unexpected event can unravel months of financial progress.",
    example:
      "If your take-home is R33 200/month, your target is R99 600–R199 200.",
    tag: "Savings",
    tagColor: "teal",
  },
  {
    id: "net-worth",
    term: "Net Worth",
    short: "Everything you own minus everything you owe.",
    full: "Net worth is the clearest single-number snapshot of your financial position. It is calculated by subtracting your total liabilities — debt, overdrafts, vehicle finance, student loans — from your total assets — savings, investments, property equity, retirement funds. A negative net worth is normal early in your career. The goal is to trend it upward consistently over time.",
    example: "Assets R180 000 − Liabilities R120 000 = Net Worth R60 000.",
    tag: "Wealth",
    tagColor: "purple",
  },
  {
    id: "paye",
    term: "PAYE",
    short: "Pay As You Earn — income tax deducted from your salary monthly.",
    full: "PAYE is the mechanism through which SARS collects income tax from employed South Africans. Your employer deducts it before you receive your pay. The amount is based on your gross salary and the annual tax brackets set by SARS. Contributing to an RA (Retirement Annuity) reduces your taxable income, which lowers the PAYE amount your employer deducts — you keep more of your money each month.",
    example: "On a R45 000 gross salary, PAYE is roughly R11 800/month.",
    tag: "Tax",
    tagColor: "amber",
  },
  {
    id: "tfsa",
    term: "TFSA",
    short: "Tax-Free Savings Account — grow money with zero tax on returns.",
    full: "A Tax-Free Savings Account lets South Africans invest up to R36 000 per year (R500 000 lifetime) with no tax on interest, dividends, or capital gains. It is one of the most powerful wealth tools available to young professionals. The lifetime limit means every year you do not contribute is an opportunity permanently lost — you cannot carry over unused allowances.",
    example:
      "R3 000/month into a TFSA at 10% growth = R230 000 after 5 years, tax-free.",
    tag: "Investing",
    tagColor: "green",
  },
  {
    id: "ra-vs-tfsa",
    term: "RA vs TFSA",
    short: "RA reduces tax now. TFSA is tax-free forever.",
    full: "A Retirement Annuity (RA) lets you deduct contributions from taxable income — up to 27.5% of gross income — reducing your PAYE immediately. But you pay tax on withdrawals in retirement. A TFSA gives no upfront tax benefit, but all returns and withdrawals are completely tax-free. Most financial advisors recommend maximising your TFSA first, then using an RA for additional tax relief if you earn enough to benefit from the deduction.",
    example: "RA saves you tax today. TFSA saves you tax forever.",
    tag: "Tax",
    tagColor: "amber",
  },
  {
    id: "etf",
    term: "ETF",
    short: "Exchange-Traded Fund — a basket of shares in one investment.",
    full: "An ETF is a collection of shares or assets bundled into a single investment that trades on the JSE. Instead of picking individual stocks, you buy a slice of hundreds of companies at once. ETFs are low-cost, diversified, and accessible from as little as R500/month. The Satrix Top 40, for example, gives exposure to the 40 largest companies on the JSE. Most passive wealth-building strategies in South Africa are built on ETFs.",
    example:
      "R2 000/month into a JSE ETF at 9% annually = R149 000 after 5 years.",
    tag: "Investing",
    tagColor: "green",
  },
  {
    id: "bond-vs-rent",
    term: "Bond vs Rent",
    short: "Owning builds equity. Renting buys flexibility.",
    full: "A bond (home loan) lets you build equity — ownership — in a property over time. But it comes with transfer duty, bond registration costs, levies, rates, and maintenance that renters never pay. Renting keeps you flexible and your capital liquid for investment. Neither is universally better. In high-rate environments like South Africa at 11% prime, the case for renting and investing the difference is often stronger than many people realise.",
    example:
      "A R1.2M property at 11% over 20 years costs R2.4M total with interest.",
    tag: "Property",
    tagColor: "coral",
  },
  {
    id: "medical-aid",
    term: "Medical Aid",
    short: "Private health cover — essential but costly in South Africa.",
    full: "Medical aid in South Africa replaces access to public healthcare for those who can afford it. It is structured in tiers — hospital plans cover in-hospital costs only; comprehensive plans cover chronic medication, GP visits, and dentistry. Discovery, Momentum, and Bonitas are the largest schemes. Contributions are not tax-deductible but medical tax credits apply. For young professionals, a hospital plan with a gap cover policy is often the most cost-effective entry point.",
    example:
      "Discovery Active Smart starts at around R1 350/month for a single adult.",
    tag: "Healthcare",
    tagColor: "blue",
  },
  {
    id: "cost-per-use",
    term: "Cost Per Use",
    short: "The real value of a purchase, spread across how often you use it.",
    full: "Cost per use reframes how you evaluate spending. A R5 000 piece of gym equipment used once costs R5 000 per use. Used 500 times, it costs R10 per use. The same logic applies to subscriptions, clothing, and gadgets. When you audit your recurring spend, cost per use reveals which services deliver genuine value and which are 'silent drains' — money leaving your account for things that have quietly stopped serving you.",
    example:
      "A R349/month streaming service you watch 30 hours costs R11.63/hour.",
    tag: "Spending",
    tagColor: "coral",
  },
  {
    id: "silent-drain",
    term: "Silent Drain",
    short: "Recurring costs you forget about but keep paying for.",
    full: "Silent drains are subscriptions, memberships, or services that once seemed valuable but have drifted into the background of your financial life. They debit quietly every month, invisible until you actively audit your bank statements. Common examples: streaming services you rarely open, gym memberships you stopped using, software subscriptions on annual billing, or forgotten free trials that converted to paid plans. Identifying and cutting these is often the fastest win in a spending audit.",
    example:
      "R150 + R99 + R349 in forgotten subscriptions = R598/month = R7 176/year.",
    tag: "Spending",
    tagColor: "coral",
  },
];

const contextualTips = [
  {
    id: "ra-tip",
    context: "Money Snapshot",
    icon: "📊",
    headline: "Your RA contributions reduce taxable income.",
    body: "Increasing your RA contribution by R500/month could lower your PAYE by roughly R175/month — money you keep immediately.",
    linked: "ra-vs-tfsa",
  },
  {
    id: "lifestyle-tip",
    context: "Spending Audit",
    icon: "🔍",
    headline: "Recurring spend often grows invisibly.",
    body: "Most people underestimate their subscription costs by 40%. An audit typically surfaces R500–R1 500/month in forgotten services.",
    linked: "silent-drain",
  },
  {
    id: "etf-tip",
    context: "Strategy Tracks",
    icon: "📈",
    headline: "Starting 5 years earlier doubles your outcome.",
    body: "R2 000/month at 9% for 30 years = R3.3M. Starting 5 years later = R2.0M. The gap is R1.3M — not five years of contributions.",
    linked: "etf",
  },
  {
    id: "bond-tip",
    context: "Know Your Money",
    icon: "🏠",
    headline: "At 11% prime, renting and investing often wins.",
    body: "A R1.2M property on a 20-year bond costs R11 000+/month. That same amount in ETFs over 20 years at 9% grows to R7.8M.",
    linked: "bond-vs-rent",
  },
];

const tagColors = {
  teal: { bg: "#E1F5EE", text: "#0F6E56" },
  purple: { bg: "#EEEDFE", text: "#3C3489" },
  amber: { bg: "#FAEEDA", text: "#854F0B" },
  green: { bg: "#EAF3DE", text: "#3B6D11" },
  coral: { bg: "#FAECE7", text: "#993C1D" },
  blue: { bg: "#E6F1FB", text: "#185FA5" },
};

function GlossaryCard({ entry, onExpand, isExpanded }) {
  const color = tagColors[entry.tagColor];
  return (
    <div
      className={`glossary-card ${isExpanded ? "glossary-card--expanded" : ""}`}
      onClick={() => onExpand(isExpanded ? null : entry.id)}
    >
      <div className="glossary-card__top">
        <div className="glossary-card__meta">
          <span
            className="glossary-card__tag"
            style={{ background: color.bg, color: color.text }}
          >
            {entry.tag}
          </span>
          <h3 className="glossary-card__term">{entry.term}</h3>
          <p className="glossary-card__short">{entry.short}</p>
        </div>
        <button className="glossary-card__toggle" aria-label="Expand">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d={isExpanded ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="glossary-card__detail">
          <p className="glossary-card__full">{entry.full}</p>
          <div className="glossary-card__example">
            <span className="glossary-card__example-label">Example</span>
            <p>{entry.example}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ContextTip({ tip, onLearnMore }) {
  return (
    <div className="context-tip">
      <div className="context-tip__source">{tip.context}</div>
      <div className="context-tip__body">
        <span className="context-tip__icon" aria-hidden="true">
          {tip.icon}
        </span>
        <div>
          <p className="context-tip__headline">{tip.headline}</p>
          <p className="context-tip__text">{tip.body}</p>
        </div>
      </div>
      <button
        className="context-tip__link"
        onClick={() => onLearnMore(tip.linked)}
      >
        See full explanation →
      </button>
    </div>
  );
}

const FILTERS = [
  "All",
  "Tax",
  "Investing",
  "Savings",
  "Spending",
  "Property",
  "Wealth",
  "Healthcare",
];

export default function ExplaineryLayer() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const handleLearnMore = (id) => {
    setExpanded(id);
    setFilter("All");
    setSearch("");
    setTimeout(() => {
      document.getElementById(`glossary-${id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const filtered = glossary.filter((entry) => {
    const matchTag = filter === "All" || entry.tag === filter;
    const matchSearch =
      search === "" ||
      entry.term.toLowerCase().includes(search.toLowerCase()) ||
      entry.short.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="explaineryLayer">
      <div className="explaineryLayer__header">
        <h1 className="explaineryLayer__title">Learn</h1>
        <p className="explaineryLayer__sub">
          Financial concepts explained in plain language, with South African
          context. Each tile is designed to be read in under 30 seconds.
        </p>
      </div>

      <section className="explaineryLayer__section">
        <h2 className="explaineryLayer__section-title">In context</h2>
        <p className="explaineryLayer__section-sub">
          These insights surface directly within the app — here they are
          collected in one place.
        </p>
        <div className="explaineryLayer__tips-grid">
          {contextualTips.map((tip) => (
            <ContextTip key={tip.id} tip={tip} onLearnMore={handleLearnMore} />
          ))}
        </div>
      </section>

      <section className="explaineryLayer__section">
        <h2 className="explaineryLayer__section-title">Glossary</h2>
        <p className="explaineryLayer__section-sub">
          Structured definitions for concepts that matter most to young South
          African professionals building wealth in their first five years.
        </p>

        <div className="explaineryLayer__controls">
          <input
            type="search"
            className="explaineryLayer__search"
            placeholder="Search a concept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="explaineryLayer__filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`explaineryLayer__filter-btn ${
                  filter === f ? "explaineryLayer__filter-btn--active" : ""
                }`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="explaineryLayer__glossary">
          {filtered.length === 0 ? (
            <p className="explaineryLayer__empty">
              No concepts match your search.
            </p>
          ) : (
            filtered.map((entry) => (
              <div id={`glossary-${entry.id}`} key={entry.id}>
                <GlossaryCard
                  entry={entry}
                  isExpanded={expanded === entry.id}
                  onExpand={setExpanded}
                />
              </div>
            ))
          )}
        </div>
      </section>

      <section className="explaineryLayer__section explaineryLayer__deeper">
        <h2 className="explaineryLayer__section-title">Go deeper</h2>
        <p className="explaineryLayer__section-sub">
          These are the areas where small decisions made today have the biggest
          long-term impact. Start here if you are new to building wealth.
        </p>
        <div className="explaineryLayer__deeper-grid">
          {[
            {
              title: "Understanding your payslip",
              desc: "PAYE, UIF, SDL — what each deduction actually is and how to reduce the ones you can.",
              tag: "Tax",
              tagColor: "amber",
            },
            {
              title: "The TFSA vs RA decision",
              desc: "Which account to prioritise first, and why the answer changes depending on your tax bracket.",
              tag: "Investing",
              tagColor: "green",
            },
            {
              title: "Banking fees in South Africa",
              desc: "The average South African pays R180–R400/month in banking fees. Here is how to audit and reduce yours.",
              tag: "Spending",
              tagColor: "coral",
            },
            {
              title: "Reading a JSE ETF fact sheet",
              desc: "TER, tracking error, dividend yield — the six numbers that tell you whether an ETF is worth owning.",
              tag: "Investing",
              tagColor: "green",
            },
          ].map((item) => {
            const color = tagColors[item.tagColor];
            return (
              <div className="deeper-card" key={item.title}>
                <span
                  className="deeper-card__tag"
                  style={{ background: color.bg, color: color.text }}
                >
                  {item.tag}
                </span>
                <h3 className="deeper-card__title">{item.title}</h3>
                <p className="deeper-card__desc">{item.desc}</p>
                <button className="deeper-card__btn">Coming soon</button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
