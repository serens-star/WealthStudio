import { useState, useEffect } from "react";
import { tracks } from "../../data/tracksData";
import { useUser } from "../../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, Lightbulb, Flag } from "lucide-react";
import "./StrategyTracks.css";

const STATUS = {
  NOT_STARTED: "not-started",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

const STATUS_LABELS = {
  [STATUS.NOT_STARTED]: "Not started",
  [STATUS.IN_PROGRESS]: "In progress",
  [STATUS.DONE]: "Done",
};

function MilestoneItem({ item, status, onCycle }) {
  return (
    <div className={`milestone-item milestone-item--${status}`}>
      <button
        className="milestone-item__toggle"
        onClick={() => onCycle(item.id)}
        title={`Status: ${STATUS_LABELS[status]} — click to update`}
      >
        <span className="milestone-item__toggle-icon">
          {status === STATUS.DONE && "✓"}
          {status === STATUS.IN_PROGRESS && "◑"}
          {status === STATUS.NOT_STARTED && "○"}
        </span>
      </button>
      <div className="milestone-item__content">
        <p className="milestone-item__text">{item.text}</p>
        <span
          className={`milestone-item__status milestone-item__status--${status}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>
    </div>
  );
}

function MilestoneBlock({ milestone, progress, onCycle }) {
  const total = milestone.items.length;
  const done = milestone.items.filter(
    (item) => progress[item.id] === STATUS.DONE
  ).length;

  return (
    <div className="milestone-block">
      <div className="milestone-block__period">
        <div
          className={`milestone-block__dot ${
            done === total ? "milestone-block__dot--done" : ""
          }`}
        />
        <div>
          <span className="milestone-block__period-label">
            {milestone.period}
          </span>
          <span className="milestone-block__period-count">
            {done}/{total} complete
          </span>
        </div>
      </div>
      <div className="milestone-block__items">
        {milestone.items.map((item) => (
          <MilestoneItem
            key={item.id}
            item={item}
            status={progress[item.id] || STATUS.NOT_STARTED}
            onCycle={onCycle}
          />
        ))}
      </div>
    </div>
  );
}

function TrackProgress({ track, progress }) {
  const allItems = track.milestones.flatMap((m) => m.items);
  const total = allItems.length;
  const done = allItems.filter((i) => progress[i.id] === STATUS.DONE).length;
  const inProgress = allItems.filter(
    (i) => progress[i.id] === STATUS.IN_PROGRESS
  ).length;
  const percent = Math.round((done / total) * 100);

  return (
    <div className="track-progress">
      <div className="track-progress__header">
        <span className="track-progress__label">Overall progress</span>
        <span className="track-progress__percent">{percent}%</span>
      </div>
      <div className="track-progress__bar">
        <div
          className="track-progress__fill track-progress__fill--done"
          style={{ width: `${percent}%` }}
        />
        <div
          className="track-progress__fill track-progress__fill--progress"
          style={{ width: `${Math.round((inProgress / total) * 100)}%` }}
        />
      </div>
      <div className="track-progress__legend">
        <span className="track-progress__legend-item track-progress__legend-item--done">
          {done} done
        </span>
        <span className="track-progress__legend-item track-progress__legend-item--progress">
          {inProgress} in progress
        </span>
        <span className="track-progress__legend-item">
          {total - done - inProgress} not started
        </span>
      </div>
    </div>
  );
}

function TrackCard({ track, isSelected, onSelect }) {
  return (
    <button
      className={`track-card ${isSelected ? "track-card--selected" : ""}`}
      onClick={() => onSelect(track.id)}
      aria-pressed={isSelected}
    >
      <div className="track-card__header">
        <h3 className="track-card__name">{track.name}</h3>
        {isSelected && <span className="track-card__badge">Active</span>}
      </div>
      <p className="track-card__tagline">{track.tagline}</p>
      <p className="track-card__desc">{track.description}</p>
      <div className="track-card__meta">
        <div className="track-card__meta-row">
          <span className="track-card__meta-label">Avoids</span>
          <span className="track-card__meta-value">{track.avoids}</span>
        </div>
        <div className="track-card__meta-row">
          <span className="track-card__meta-label">Trade-off</span>
          <span className="track-card__meta-value">{track.tradeoff}</span>
        </div>
      </div>
    </button>
  );
}

function DynamicNudge({ track, user }) {
  const categories = user.categories || [];
  const takeHome = user.takeHome || 33200;
  const savingsCategory = categories.find((c) => c.id === "savings");
  const debtCategory = categories.find((c) => c.id === "debt");
  const lifestyleCategory = categories.find((c) => c.id === "lifestyle");

  const savingsRate = Math.round(
    ((savingsCategory?.amount || 0) / takeHome) * 100
  );
  const dti = Math.round(((debtCategory?.amount || 0) / takeHome) * 100);
  const lifestylePct = Math.round(
    ((lifestyleCategory?.amount || 0) / takeHome) * 100
  );
  const totalDebt = Object.values(user.debts || {}).reduce((s, v) => s + v, 0);

  const getNudge = () => {
    if (track.id === "debt-first") {
      if (dti > 15) {
        return `Your debt repayments are ${dti}% of take-home — above the 15% threshold. Prioritising debt clearance now will free up R ${(
          debtCategory?.amount || 0
        ).toLocaleString("en-ZA")}/month within your payoff window.`;
      }
      if (totalDebt > 200000) {
        return `With R ${totalDebt.toLocaleString(
          "en-ZA"
        )} in total debt, the Debt First track targets your highest-interest obligations first — typically credit cards at 20%+ before vehicle finance at 13%.`;
      }
      return `Your credit card interest is costing you more than an ETF would earn you right now. Clear debt first, then invest the freed-up cash flow.`;
    }

    if (track.id === "balanced-growth") {
      if (lifestylePct > 25) {
        return `Your lifestyle spending is ${lifestylePct}% of take-home — watch for creep here. On the Balanced Growth track, keeping lifestyle below 25% protects your savings contributions.`;
      }
      if (savingsRate < 10) {
        return `You're currently saving ${savingsRate}% of take-home. The Balanced Growth track targets 15% — increasing by R ${Math.round(
          takeHome * 0.05
        ).toLocaleString("en-ZA")}/month would close that gap.`;
      }
      return `Your expenses are growing — make sure your savings rate grows with your income. On R ${takeHome.toLocaleString(
        "en-ZA"
      )} take-home, 15% savings means R ${Math.round(
        takeHome * 0.15
      ).toLocaleString("en-ZA")}/month.`;
    }

    if (track.id === "aggressive-invest") {
      if (savingsRate >= 15) {
        return `You're saving ${savingsRate}% of take-home — strong position. At R ${(
          savingsCategory?.amount || 0
        ).toLocaleString(
          "en-ZA"
        )}/month into ETFs at 9%, you're on track to reach R ${Math.round(
          (savingsCategory?.amount || 0) * ((Math.pow(1.0075, 60) - 1) / 0.0075)
        ).toLocaleString("en-ZA")} in 5 years.`;
      }
      return `You've hit your monthly investment target. To reach R300K by year 5, you need R ${Math.round(
        300000 / ((Math.pow(1.0075, 60) - 1) / 0.0075)
      ).toLocaleString("en-ZA")}/month at 9% annual growth.`;
    }

    return track.nudge;
  };

  return (
    <div className="tracks-nudge">
      <p className="tracks-nudge__label">Your nudge</p>
      <p className="tracks-nudge__body">"{getNudge()}"</p>
    </div>
  );
}

function YearTimeline({ progress, track }) {
  const allItems = track.milestones.flatMap((m) => m.items);
  const totalItems = allItems.length;
  const doneItems = allItems.filter(
    (i) => progress[i.id] === STATUS.DONE
  ).length;

  const years = [
    { label: "Year 1", milestoneIndex: 0 },
    { label: "Year 2-3", milestoneIndex: 1 },
    { label: "Year 4-5", milestoneIndex: 2 },
  ];

  const getMilestoneStatus = (index) => {
    const milestone = track.milestones[index];
    if (!milestone) return "locked";
    const items = milestone.items;
    const done = items.filter((i) => progress[i.id] === STATUS.DONE).length;
    const inProg = items.filter(
      (i) => progress[i.id] === STATUS.IN_PROGRESS
    ).length;
    if (done === items.length) return "done";
    if (done > 0 || inProg > 0) return "active";
    return "locked";
  };

  const overallPercent = Math.round((doneItems / totalItems) * 100);

  return (
    <div className="year-timeline">
      <div className="year-timeline__header">
        <span className="year-timeline__label">Five-year journey</span>
        <span className="year-timeline__percent">
          {overallPercent}% complete
        </span>
      </div>
      <div className="year-timeline__track">
        <div
          className="year-timeline__fill"
          style={{ width: `${overallPercent}%` }}
        />
      </div>
      <div className="year-timeline__markers">
        {years.map((year, i) => {
          const status = getMilestoneStatus(year.milestoneIndex);
          return (
            <div key={year.label} className="year-timeline__marker">
              <div
                className={`year-timeline__dot year-timeline__dot--${status}`}
              >
                {status === "done" && "✓"}
                {status === "active" && "◑"}
                {status === "locked" && i + 1}
              </div>
              <span className="year-timeline__marker-label">{year.label}</span>
            </div>
          );
        })}
        <div className="year-timeline__marker">
          <div
            className={`year-timeline__dot year-timeline__dot--${
              overallPercent === 100 ? "done" : "locked"
            }`}
          >
            {overallPercent === 100 ? "✓" : <Flag size={12} />}
          </div>
          <span className="year-timeline__marker-label">Goal reached</span>
        </div>
      </div>
    </div>
  );
}

function RecommendationBanner({ user, selectedId, onSelect }) {
  const categories = user.categories || [];
  const takeHome = user.takeHome || 33200;
  const debtCategory = categories.find((c) => c.id === "debt");
  const savingsCategory = categories.find((c) => c.id === "savings");

  const monthlyDebt = debtCategory?.amount || 0;
  const monthlySavings = savingsCategory?.amount || 0;
  const dti = Math.round((monthlyDebt / takeHome) * 100);
  const savingsRate = Math.round((monthlySavings / takeHome) * 100);
  const totalDebt = Object.values(user.debts || {}).reduce((s, v) => s + v, 0);

  let recommendedId = "balanced-growth";
  let reason = "";
  let urgent = false;

  if (totalDebt > 100000 || dti > 15) {
    recommendedId = "debt-first";
    reason = `Your total debt is R ${totalDebt.toLocaleString(
      "en-ZA"
    )} and your debt repayments are ${dti}% of take-home. Clearing high-interest debt first will free up significant cash flow within 2–3 years.`;
    urgent = dti > 20;
  } else if (savingsRate < 8) {
    recommendedId = "balanced-growth";
    reason = `Your savings rate is ${savingsRate}% — below the 15% target. The Balanced Growth track helps you build savings and investments steadily without overcommitting.`;
  } else if (savingsRate >= 15 && totalDebt < 50000) {
    recommendedId = "aggressive-invest";
    reason = `Your savings rate is ${savingsRate}% and your debt load is manageable at R ${totalDebt.toLocaleString(
      "en-ZA"
    )}. You're in a strong position to maximise early investment contributions.`;
  } else {
    reason = `Based on your savings rate of ${savingsRate}% and current debt position, Balanced Growth gives you the most sustainable path through your first five years.`;
  }

  const alreadyOnRecommended = selectedId === recommendedId;

  if (alreadyOnRecommended) return null;

  const recommendedTrack = tracks.find((t) => t.id === recommendedId);

  return (
    <div className={`rec-banner ${urgent ? "rec-banner--urgent" : ""}`}>
      <div className="rec-banner__icon">
        {urgent ? <AlertTriangle size={18} /> : <Lightbulb size={18} />}
      </div>
      <div className="rec-banner__content">
        <p className="rec-banner__title">
          Based on your numbers, we recommend{" "}
          <strong>{recommendedTrack?.name}</strong>
        </p>
        <p className="rec-banner__reason">{reason}</p>
      </div>
      <button
        className="rec-banner__cta"
        onClick={() => onSelect(recommendedId)}
      >
        Switch track
      </button>
    </div>
  );
}

function TrackRationale({ track }) {
  const rationale = {
    "debt-first": {
      why: "High-interest debt is the single biggest drag on wealth-building for young South African professionals. Credit card interest at 20%+ and vehicle finance at 13% cost more than most investments earn. This track treats debt elimination as the highest-return investment you can make right now.",
      bestFor:
        "Professionals with credit card balances, student loans, or vehicle finance exceeding 15% of take-home pay.",
      watch:
        "Resist the temptation to invest aggressively before debt is cleared. The maths rarely favours it.",
    },
    "balanced-growth": {
      why: "Most young professionals benefit most from a steady, diversified approach — paying down debt while simultaneously building an emergency fund and beginning retirement contributions. This prevents the all-or-nothing thinking that leaves people either over-indebted or under-invested.",
      bestFor:
        "Professionals with manageable debt, a stable income, and a desire to build multiple financial pillars simultaneously.",
      watch:
        "Lifestyle creep is the main risk here. As income grows, ensure your savings rate grows with it.",
    },
    "aggressive-invest": {
      why: "Compound interest rewards those who start early. A R2 000/month ETF investment started at 25 grows to approximately R1.4 million by 55 at 9% annual returns. Waiting until 35 to start produces roughly R580 000 — less than half. For those with low debt and stable income, early aggressive investing is mathematically compelling.",
      bestFor:
        "Professionals with minimal debt, a solid emergency fund, and high risk tolerance who want to maximise long-term wealth.",
      watch:
        "This track requires a genuine emergency fund buffer. Without one, a single unexpected expense forces you to sell investments at the wrong time.",
    },
  };

  const content = rationale[track.id];
  if (!content) return null;

  return (
    <div className="track-rationale">
      <p className="track-rationale__heading">Why this track exists</p>
      <p className="track-rationale__why">{content.why}</p>
      <div className="track-rationale__grid">
        <div className="track-rationale__item">
          <p className="track-rationale__item-label">Best for</p>
          <p className="track-rationale__item-value">{content.bestFor}</p>
        </div>
        <div className="track-rationale__item track-rationale__item--warn">
          <p className="track-rationale__item-label">Watch out for</p>
          <p className="track-rationale__item-value">{content.watch}</p>
        </div>
      </div>
    </div>
  );
}

export default function StrategyTracks() {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const savedTrack = localStorage.getItem("selectedTrack") || "balanced-growth";
  const [selectedId, setSelectedId] = useState(trackId || savedTrack);
  
  useEffect(() => {
    if (trackId && trackId !== selectedId) {
      setSelectedId(trackId);
    }
  }, [trackId]);
  
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("milestoneProgress");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("milestoneProgress", JSON.stringify(progress));
  }, [progress]);

  const selectedTrack = tracks.find((t) => t.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    localStorage.setItem("selectedTrack", id);
    navigate(`/tracks/${id}`);
  };
  const cycleStatus = (itemId) => {
    setProgress((prev) => {
      const current = prev[itemId] || STATUS.NOT_STARTED;
      const next =
        current === STATUS.NOT_STARTED
          ? STATUS.IN_PROGRESS
          : current === STATUS.IN_PROGRESS
          ? STATUS.DONE
          : STATUS.NOT_STARTED;
      return { ...prev, [itemId]: next };
    });
  };

  const resetProgress = () => {
    if (!selectedTrack) return;
    const allIds = selectedTrack.milestones
      .flatMap((m) => m.items)
      .map((i) => i.id);
    setProgress((prev) => {
      const updated = { ...prev };
      allIds.forEach((id) => delete updated[id]);
      return updated;
    });
  };

  return (
    <div className="tracks">
      <div className="tracks__header">
        <div>
          <h1 className="tracks__title">Strategy Tracks</h1>
          <p className="tracks__sub">
            Choose the financial path that fits your life right now. Your track
            shapes your milestones, nudges, and recommendations across the next
            five years.
          </p>
        </div>
      </div>

      <section className="tracks__section">
        <p className="tracks__section-label">Choose your track</p>
        <div className="tracks__grid">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isSelected={selectedId === track.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </section>

      {selectedTrack && (
        <section className="tracks__section tracks__detail">
          <RecommendationBanner
            user={user}
            selectedId={selectedId}
            onSelect={handleSelect}
          />

          <div className="tracks__detail-header">
            <div>
              <p className="tracks__section-label">Your five-year plan</p>
              <h2 className="tracks__detail-title">{selectedTrack.name}</h2>
            </div>
            <button className="tracks__reset-btn" onClick={resetProgress}>
              Reset progress
            </button>
          </div>

          <YearTimeline progress={progress} track={selectedTrack} />

          <TrackProgress track={selectedTrack} progress={progress} />

          <TrackRationale track={selectedTrack} />

          <div className="tracks__detail-body">
            <div className="tracks__milestones">
              <p className="tracks__milestones-label">
                Click each milestone to update its status
              </p>
              <div className="tracks__milestones-list">
                {selectedTrack.milestones.map((milestone) => (
                  <MilestoneBlock
                    key={milestone.period}
                    milestone={milestone}
                    progress={progress}
                    onCycle={cycleStatus}
                  />
                ))}
              </div>
            </div>

            <div className="tracks__sidebar">
              <DynamicNudge track={selectedTrack} user={user} />
              <div className="tracks__info-card">
                <p className="tracks__info-label">What this track avoids</p>
                <p className="tracks__info-value">{selectedTrack.avoids}</p>
              </div>
              <div className="tracks__info-card tracks__info-card--warn">
                <p className="tracks__info-label">Trade-off to be aware of</p>
                <p className="tracks__info-value">{selectedTrack.tradeoff}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
