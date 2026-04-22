import { useState } from "react";
import { currentUser } from "../../data/userData";
import "./Profile.css";

const trackColors = {
  "Balanced growth": { bg: "#E1F5EE", text: "#0F6E56" },
  "Debt First": { bg: "#FAEEDA", text: "#854F0B" },
  "Aggressive Investment": { bg: "#EEEDFE", text: "#3C3489" },
};

function StatRow({ label, value, muted }) {
  return (
    <div className="profile-stat-row">
      <span className="profile-stat-row__label">{label}</span>
      <span
        className={`profile-stat-row__value ${
          muted ? "profile-stat-row__value--muted" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function GoalBar({ goal }) {
  const pct = Math.min((goal.current / goal.target) * 100, 100);
  return (
    <div className="profile-goal">
      <div className="profile-goal__top">
        <span className="profile-goal__name">{goal.name}</span>
        <span className="profile-goal__pct">{Math.round(pct)}%</span>
      </div>
      <div className="profile-goal__track">
        <div className="profile-goal__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="profile-goal__amounts">
        <span>R{goal.current.toLocaleString()}</span>
        <span className="profile-goal__target">
          of R{goal.target.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function Profile() {
  const user = currentUser;
  const trackColor = trackColors[user.track] || trackColors["Balanced growth"];
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.name);
  const [draftName, setDraftName] = useState(user.name);

  const netWorth = user.goals.reduce((sum, g) => sum + g.current, 0) - 0;

  const savingsRate = Math.round(
    (user.spending.savedInvested / user.takeHome) * 100
  );

  return (
    <div className="profile">
      <div className="profile__header">
        <h1 className="profile__title">Profile</h1>
      </div>

      <div className="profile__grid">
        {/* Identity card */}
        <div className="profile-card profile-card--identity">
          <div className="profile-avatar">{user.initials}</div>
          <div className="profile-identity">
            {editing ? (
              <div className="profile-identity__edit">
                <input
                  className="profile-identity__input"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  autoFocus
                />
                <div className="profile-identity__actions">
                  <button
                    className="profile-btn profile-btn--primary"
                    onClick={() => {
                      setDisplayName(draftName);
                      setEditing(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="profile-btn"
                    onClick={() => {
                      setDraftName(displayName);
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="profile-identity__name">{displayName}</h2>
                <p className="profile-identity__email">{user.email}</p>
                <button
                  className="profile-identity__edit-btn"
                  onClick={() => setEditing(true)}
                >
                  Edit name
                </button>
              </>
            )}
          </div>
        </div>

        {/* Track */}
        <div className="profile-card">
          <p className="profile-card__label">Active track</p>
          <div className="profile-track">
            <span
              className="profile-track__badge"
              style={{ background: trackColor.bg, color: trackColor.text }}
            >
              {user.track}
            </span>
            <p className="profile-track__note">
              Your strategy track shapes the nudges, milestones, and
              recommendations you see across the app.
            </p>
          </div>
        </div>

        {/* Financial summary */}
        <div className="profile-card profile-card--wide">
          <p className="profile-card__label">Financial summary</p>
          <div className="profile-stats">
            <StatRow
              label="Gross salary"
              value={`R${user.grossSalary.toLocaleString()}/mo`}
            />
            <StatRow
              label="PAYE deducted"
              value={`−R${user.paye.toLocaleString()}/mo`}
              muted
            />
            <StatRow
              label="Take-home pay"
              value={`R${user.takeHome.toLocaleString()}/mo`}
            />
            <StatRow
              label="Savings rate"
              value={`${savingsRate}% of take-home`}
            />
            <StatRow
              label="RA contribution"
              value={`R${user.saContext.raContribution.toLocaleString()}/mo`}
            />
            <StatRow
              label="Medical aid"
              value={`R${user.saContext.medicalAid.toLocaleString()}/mo`}
            />
            <StatRow
              label="Banking fees"
              value={`R${user.saContext.bankCharges}/mo`}
              muted
            />
            <StatRow
              label="Credit card interest"
              value={`R${user.saContext.creditCardInterest}/mo`}
              muted
            />
          </div>
        </div>

        {/* Goals */}
        <div className="profile-card profile-card--wide">
          <p className="profile-card__label">Goals progress</p>
          <div className="profile-goals">
            {user.goals.map((goal) => (
              <GoalBar key={goal.id} goal={goal} />
            ))}
          </div>
          <p className="profile-goals__note">
            Goals update automatically based on your Money Snapshot data.
          </p>
        </div>

        {/* SA context */}
        <div className="profile-card">
          <p className="profile-card__label">South African context</p>
          <div className="profile-sa">
            <p className="profile-sa__item">
              <span className="profile-sa__key">Medical aid scheme</span>
              <span className="profile-sa__val">
                {user.saContext.medicalAidName}
              </span>
            </p>
            <p className="profile-sa__item">
              <span className="profile-sa__key">RA deduction benefit</span>
              <span className="profile-sa__val">
                Reduces taxable income by R
                {(user.saContext.raContribution * 12).toLocaleString()}/year
              </span>
            </p>
            <p className="profile-sa__tip">
              Increasing your RA contribution by R500/month could lower your
              monthly PAYE by approximately R175 — money you keep immediately.
            </p>
          </div>
        </div>

        {/* Nudges */}
        <div className="profile-card">
          <p className="profile-card__label">Active nudges</p>
          <div className="profile-nudges">
            {user.nudges.map((nudge) => (
              <div
                key={nudge.id}
                className={`profile-nudge profile-nudge--${nudge.type}`}
              >
                <p className="profile-nudge__title">{nudge.title}</p>
                <p className="profile-nudge__body">{nudge.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
