import { useState } from "react";
import { tracks } from "../../data/tracksData";
import "./StrategyTracks.css";

// function TrackCard({ track, isSelected, onSelect }) {
//   return (
//     <button
//       className={`track-card ${isSelected ? "track-card--selected" : ""}`}
//       onClick={() => onSelect(track.id)}
//       aria-pressed={isSelected}
//     >
//       <div className="track-card__header">
//         <h3 className="track-card__name">{track.name}</h3>
//         {isSelected && <span className="track-card__badge">Active</span>}
//       </div>
//       <p className="track-card__tagline">{track.tagline}</p>
//       <p className="track-card__desc">{track.description}</p>
//       <div className="track-card__meta-row">
//         <span className="track-card__meta-label">Avoids</span>
//         <span className="track-card__meta-value">{track.avoids}</span>
//       </div>
//       <div className="track-card__meta-row">
//         <span className="track-card__meta-label">Trade-off</span>
//         <span className="track-card__meta-value">{track.tradeoff}</span>
//       </div>
//     </button>
//   );
// }

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

function NudgeCard({ nudge }) {
  return (
    <div className="tracks-nudge">
      <p className="tracks-nudge__label">Sample nudge</p>
      <p className="tracks-nudge__body">"{nudge}"</p>
    </div>
  );
}

export default function StrategyTracks() {
  const savedTrack = localStorage.getItem("selectedTrack") || "balanced-growth";
  const [selectedId, setSelectedId] = useState(savedTrack);

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
          <div className="tracks__detail-header">
            <div>
              <p className="tracks__section-label">Your five-year plan</p>
              <h2 className="tracks__detail-title">{selectedTrack.name}</h2>
            </div>
            <button className="tracks__reset-btn" onClick={resetProgress}>
              Reset progress
            </button>
          </div>

          <TrackProgress track={selectedTrack} progress={progress} />

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
              <NudgeCard nudge={selectedTrack.nudge} />
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
