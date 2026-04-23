import { Link } from "react-router-dom";
import "./Landing.css";

const features = [
  {
    id: 1,
    label: "Money Snapshot",
    heading: "See your full financial picture.",
    body: "Your take-home pay, fixed costs, spending breakdown, and goals — all in one view. No abstract numbers. Just clarity.",
  },
  {
    id: 2,
    label: "Strategy Tracks",
    heading: "A five-year plan built for your life.",
    body: "Choose between Debt First, Balanced Growth, or Aggressive Investment. Year-by-year milestones that show you exactly what to do next.",
  },
  {
    id: 3,
    label: "Simulation Studio",
    heading: "Test decisions before you make them.",
    body: "Should you buy or rent? Finance the car or invest the difference? Run the numbers with real SA context before committing.",
  },
  {
    id: 4,
    label: "Learn",
    heading: "Understand why it matters.",
    body: "Interactive explainers on PAYE, RAs, compound interest, and emergency funds — written for South African young professionals.",
  },
];

const stats = [
  { value: "R30K–R70K", label: "Target income bracket" },
  { value: "5 years", label: "Planning horizon" },
  { value: "3", label: "Strategy tracks" },
  { value: "SA-first", label: "Built for South Africa" },
];

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing__nav">
        <div className="landing__nav-brand">
          <div className="landing__nav-mark">NW</div>
          <span className="landing__nav-name">NextGen Wealth</span>
        </div>
        <div className="landing__nav-actions">
          <Link to="/login" className="landing__nav-signin">
            Sign in
          </Link>
          <Link to="/register" className="landing__nav-cta">
            Get started
          </Link>
        </div>
      </nav>

      <section className="landing__hero">
        <div className="landing__hero-content">
          <div className="landing__hero-badge">
            Built for South African young professionals
          </div>
          <h1 className="landing__hero-title">
            Your first five years
            <br />
            <span className="landing__hero-title-accent">done right.</span>
          </h1>
          <p className="landing__hero-sub">
            NextGen Wealth Studio is a digital companion for high-earning
            professionals aged 23 to 35. Get a live picture of your finances, a
            personalised strategy for the next five years, and a space to
            simulate big decisions before you make them.
          </p>
          <div className="landing__hero-actions">
            <Link to="/register" className="landing__btn-primary">
              Create your account
            </Link>
            <Link to="/login" className="landing__btn-secondary">
              Sign in
            </Link>
          </div>
        </div>
        <div className="landing__hero-visual">
          <div className="landing__mockup">
            <div className="landing__mockup-bar">
              <div className="landing__mockup-dot" />
              <div className="landing__mockup-dot" />
              <div className="landing__mockup-dot" />
            </div>
            <div className="landing__mockup-greeting">Good morning</div>
            <div className="landing__mockup-name">Obakeng</div>
            <div className="landing__mockup-card">
              <div className="landing__mockup-card-label">
                Take-home this month
              </div>
              <div className="landing__mockup-card-value">R 33 200</div>
              <div className="landing__mockup-card-sub">
                Gross R 45 000 · PAYE − R 11 800
              </div>
            </div>
            <div className="landing__mockup-tiles">
              <div className="landing__mockup-tile">
                <div className="landing__mockup-tile-label">Fixed costs</div>
                <div className="landing__mockup-tile-value">R 18 400</div>
                <div className="landing__mockup-tile-sub">55%</div>
              </div>
              <div className="landing__mockup-tile">
                <div className="landing__mockup-tile-label">Saved</div>
                <div className="landing__mockup-tile-value">R 3 200</div>
                <div className="landing__mockup-tile-sub">10%</div>
              </div>
              <div className="landing__mockup-tile">
                <div className="landing__mockup-tile-label">Goals</div>
                <div className="landing__mockup-tile-value">2 / 3</div>
                <div className="landing__mockup-tile-sub">on track</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing__stats">
        {stats.map((s) => (
          <div key={s.label} className="landing__stat">
            <span className="landing__stat-value">{s.value}</span>
            <span className="landing__stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="landing__features">
        <div className="landing__features-header">
          <h2 className="landing__features-title">
            Everything you need for your first five years.
          </h2>
          <p className="landing__features-sub">
            Four core tools, built around the real decisions young South African
            professionals face when they start earning well.
          </p>
        </div>
        <div className="landing__features-grid">
          {features.map((f) => (
            <div key={f.id} className="landing__feature-card">
              <span className="landing__feature-label">{f.label}</span>
              <h3 className="landing__feature-heading">{f.heading}</h3>
              <p className="landing__feature-body">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing__sa">
        <div className="landing__sa-content">
          <h2 className="landing__sa-title">Built for South Africa.</h2>
          <p className="landing__sa-body">
            Every number, every calculation, and every recommendation is
            grounded in South African reality. PAYE using the SARS 2024/25 tax
            tables. Property costs with transfer duty thresholds. Vehicle
            finance at prime-linked rates. JSE and MSCI returns. Medical aid and
            RA deductions. This is not a generic financial app with ZAR pasted
            on top.
          </p>
          <div className="landing__sa-tags">
            {[
              "SARS PAYE",
              "Transfer duty",
              "Retirement annuities",
              "Medical aid",
              "JSE returns",
              "TFSA limits",
              "GEPF",
              "Prime lending rate",
              "Rand depreciation",
            ].map((tag) => (
              <span key={tag} className="landing__sa-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="landing__cta">
        <h2 className="landing__cta-title">
          Start your first five years right.
        </h2>
        <p className="landing__cta-sub">
          Free to use. No bank connection required. Just your numbers and a
          clear path forward.
        </p>
        <Link
          to="/register"
          className="landing__btn-primary landing__btn-primary--large"
        >
          Create your free account
        </Link>
      </section>

      <footer className="landing__footer">
        <div className="landing__footer-brand">
          <div className="landing__nav-mark landing__nav-mark--sm">NW</div>
          <span>NextGen Wealth Studio</span>
        </div>
        <p className="landing__footer-note">
          A concept product by ABSA Digital Arts. Not financial advice.
        </p>
      </footer>
    </div>
  );
}
