import { useState } from "react";
import { tracks } from "../../data/tracksData";
import "./StrategyTracks.css";

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
      <div className="track-card__meta-row">
        <span className="track-card__meta-label">Avoids</span>
        <span className="track-card__meta-value">{track.avoids}</span>
      </div>
      <div className="track-card__meta-row">
        <span className="track-card__meta-label">Trade-off</span>
        <span className="track-card__meta-value">{track.tradeoff}</span>
      </div>
    </button>
  );
}

function MilestoneBlock({ milestone, index }) {
  return (
    <div className="milestone-block">
      <div className="milestone-block__period">
        <div className="milestone-block__dot" />
        <span>{milestone.period}</span>
      </div>
      <ul className="milestone-block__list">
        {milestone.items.map((item, i) => (
          <li key={i} className="milestone-block__item">
            {item}
          </li>
        ))}
      </ul>
    </div>
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

  const selectedTrack = tracks.find((t) => t.id === selectedId);

  const handeleSelect = (id) => {
    setSelectedIq(id);
    localStorage.setItem("selectedTrack", id);
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
              onSelect={handeleSelect}
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
          </div>

          <div className="tracks__detail-body">
            <div className="tracks__milestones">
              <p className="tracks__milestones-label">Year by year</p>
              <div className="tracks__milestones-list">
                {selectedTrack.milestones.map((milestone, i) => (
                  <MilestoneBlock
                    key={milestone.period}
                    milestone={milestone}
                    index={i}
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
