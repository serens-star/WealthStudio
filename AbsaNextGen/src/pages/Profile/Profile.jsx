import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { tracks } from "../../data/tracksData";
import InlineEdit from "../../components/InlineEdit/InlineEdit";
import "./Profile.css";

function SectionLabel({ children }) {
  return <p className="profile__section-label">{children}</p>;
}

function InfoRow({ label, children }) {
  return (
    <div className="profile__row">
      <span className="profile__row-label">{label}</span>
      <span className="profile__row-value">{children}</span>
    </div>
  );
}

function GoalRow({ goal, onUpdate, onRemove }) {
  return (
    <div className="profile__goal-row">
      <div className="profile__goal-info">
        <InlineEdit
          value={goal.name}
          onSave={(val) => onUpdate(goal.id, { name: val })}
          displayClassName="profile__goal-name"
        />
        <div className="profile__goal-amounts">
          <span>R </span>
          <InlineEdit
            value={goal.current}
            type="number"
            onSave={(val) => onUpdate(goal.id, { current: val })}
          />
          <span> of R </span>
          <InlineEdit
            value={goal.target}
            type="number"
            onSave={(val) => onUpdate(goal.id, { target: val })}
          />
        </div>
      </div>
      <div className="profile__goal-track">
        <div
          className="profile__goal-fill"
          style={{
            width: `${Math.min(
              100,
              Math.round((goal.current / goal.target) * 100)
            )}%`,
          }}
        />
      </div>
      <button
        className="profile__goal-remove"
        onClick={() => onRemove(goal.id)}
        title="Remove goal"
      >
        ✕
      </button>
    </div>
  );
}

function NudgeRow({ nudge, onUpdate, onRemove }) {
  return (
    <div className={`profile__nudge-row profile__nudge-row--${nudge.type}`}>
      <div className="profile__nudge-content">
        <InlineEdit
          value={nudge.title}
          onSave={(val) => onUpdate(nudge.id, { title: val })}
          displayClassName="profile__nudge-title"
        />
        <InlineEdit
          value={nudge.body}
          onSave={(val) => onUpdate(nudge.id, { body: val })}
          displayClassName="profile__nudge-body"
        />
      </div>
      <div className="profile__nudge-controls">
        <select
          className="profile__nudge-type"
          value={nudge.type}
          onChange={(e) => onUpdate(nudge.id, { type: e.target.value })}
        >
          <option value="warning">Warning</option>
          <option value="success">Success</option>
        </select>
        <button
          className="profile__goal-remove"
          onClick={() => onRemove(nudge.id)}
          title="Remove nudge"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const {
    user,
    updateUser,
    updateSpending,
    updateSaContext,
    updateGoal,
    addGoal,
    removeGoal,
    updateNudge,
    addNudge,
    removeNudge,
    resetUser,
  } = useUser();

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddNudge, setShowAddNudge] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", current: 0, target: 0 });
  const [newNudge, setNewNudge] = useState({
    title: "",
    body: "",
    type: "warning",
  });
  const [showReset, setShowReset] = useState(false);

  const selectedTrack =
    tracks.find((t) => t.id === localStorage.getItem("selectedTrack")) ||
    tracks[1];

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    addGoal(newGoal);
    setNewGoal({ name: "", current: 0, target: 0 });
    setShowAddGoal(false);
  };

  const handleAddNudge = () => {
    if (!newNudge.title || !newNudge.body) return;
    addNudge(newNudge);
    setNewNudge({ title: "", body: "", type: "warning" });
    setShowAddNudge(false);
  };

  const takeHome = user.grossSalary - user.paye;

  return (
    <div className="profile">
      <div className="profile__header">
        <h1 className="profile__title">Profile</h1>
        <button
          className="profile__reset-btn"
          onClick={() => setShowReset(true)}
        >
          Reset to defaults
        </button>
      </div>

      {showReset && (
        <div className="profile__confirm">
          <p>
            This will reset all your data to the demo defaults. Are you sure?
          </p>
          <div className="profile__confirm-actions">
            <button
              className="profile__confirm-yes"
              onClick={() => {
                resetUser();
                setShowReset(false);
              }}
            >
              Yes, reset
            </button>
            <button
              className="profile__confirm-no"
              onClick={() => setShowReset(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="profile__hint">
        <span>✎</span> Click any value to edit it. Press Enter to save, Escape
        to cancel.
      </div>

      <div className="profile__grid">
        <section className="profile__card">
          <SectionLabel>Personal</SectionLabel>
          <div className="profile__identity">
            <div className="profile__avatar">
              <InlineEdit
                value={user.initials}
                onSave={(val) =>
                  updateUser({ initials: val.toUpperCase().slice(0, 2) })
                }
                displayClassName="profile__avatar-text"
              />
            </div>
            <div className="profile__identity-info">
              <InlineEdit
                value={user.name}
                onSave={(val) => updateUser({ name: val })}
                displayClassName="profile__name"
              />
              <InlineEdit
                value={user.email}
                onSave={(val) => {
                  updateUser({ email: val });
                  localStorage.setItem("currentUser", val);
                }}
                displayClassName="profile__email"
              />
            </div>
          </div>
          <div className="profile__track-info">
            <SectionLabel>Active track</SectionLabel>
            <span className="profile__track-badge">{selectedTrack.name}</span>
            <p className="profile__track-desc">
              Your strategy track shapes the nudges, milestones, and
              recommendations you see across the app.
            </p>
          </div>
        </section>

        <section className="profile__card">
          <SectionLabel>Financial summary</SectionLabel>
          <InfoRow label="Gross salary">
            R{" "}
            <InlineEdit
              value={user.grossSalary}
              type="number"
              onSave={(val) =>
                updateUser({ grossSalary: val, takeHome: val - user.paye })
              }
            />
            /mo
          </InfoRow>
          <InfoRow label="PAYE deducted">
            −R{" "}
            <InlineEdit
              value={user.paye}
              type="number"
              onSave={(val) =>
                updateUser({ paye: val, takeHome: user.grossSalary - val })
              }
            />
            /mo
          </InfoRow>
          <InfoRow label="Take-home pay">
            R {takeHome.toLocaleString("en-ZA")}/mo
          </InfoRow>
          <InfoRow label="Savings rate">
            {Math.round((user.spending.savedInvested / takeHome) * 100)}% of
            take-home
          </InfoRow>
          <InfoRow label="RA contribution">
            R{" "}
            <InlineEdit
              value={user.saContext.raContribution}
              type="number"
              onSave={(val) => updateSaContext({ raContribution: val })}
            />
            /mo
          </InfoRow>
          <InfoRow label="Medical aid">
            R{" "}
            <InlineEdit
              value={user.saContext.medicalAid}
              type="number"
              onSave={(val) => updateSaContext({ medicalAid: val })}
            />
            /mo
          </InfoRow>
          <InfoRow label="Banking fees">
            R{" "}
            <InlineEdit
              value={user.saContext.bankCharges}
              type="number"
              onSave={(val) => updateSaContext({ bankCharges: val })}
            />
            /mo
          </InfoRow>
          <InfoRow label="Credit card interest">
            R{" "}
            <InlineEdit
              value={user.saContext.creditCardInterest}
              type="number"
              onSave={(val) => updateSaContext({ creditCardInterest: val })}
            />
            /mo
          </InfoRow>
        </section>

        <section className="profile__card">
          <SectionLabel>Monthly spending</SectionLabel>
          <InfoRow label="Fixed costs">
            R{" "}
            <InlineEdit
              value={user.spending.fixedCosts}
              type="number"
              onSave={(val) => updateSpending({ fixedCosts: val })}
            />
            /mo
          </InfoRow>
          <InfoRow label="Discretionary">
            R{" "}
            <InlineEdit
              value={user.spending.discretionary}
              type="number"
              onSave={(val) => updateSpending({ discretionary: val })}
            />
            /mo
          </InfoRow>
          <InfoRow label="Saved / invested">
            R{" "}
            <InlineEdit
              value={user.spending.savedInvested}
              type="number"
              onSave={(val) => updateSpending({ savedInvested: val })}
            />
            /mo
          </InfoRow>
          <InfoRow label="Invisible costs">
            R{" "}
            <InlineEdit
              value={user.spending.invisibleCosts}
              type="number"
              onSave={(val) => updateSpending({ invisibleCosts: val })}
            />
            /mo
          </InfoRow>
        </section>

        <section className="profile__card">
          <div className="profile__card-header">
            <SectionLabel>Goals progress</SectionLabel>
            <button
              className="profile__add-btn"
              onClick={() => setShowAddGoal(true)}
            >
              + Add goal
            </button>
          </div>

          {showAddGoal && (
            <div className="profile__add-form">
              <input
                className="profile__add-input"
                placeholder="Goal name"
                value={newGoal.name}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, name: e.target.value })
                }
              />
              <input
                className="profile__add-input"
                type="number"
                placeholder="Current amount (R)"
                value={newGoal.current || ""}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, current: Number(e.target.value) })
                }
              />
              <input
                className="profile__add-input"
                type="number"
                placeholder="Target amount (R)"
                value={newGoal.target || ""}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, target: Number(e.target.value) })
                }
              />
              <div className="profile__add-actions">
                <button className="profile__add-save" onClick={handleAddGoal}>
                  Save
                </button>
                <button
                  className="profile__add-cancel"
                  onClick={() => setShowAddGoal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="profile__goals">
            {user.goals.map((goal) => (
              <GoalRow
                key={goal.id}
                goal={goal}
                onUpdate={updateGoal}
                onRemove={removeGoal}
              />
            ))}
          </div>
          <p className="profile__goals-note">
            Goals update automatically based on your Money Snapshot data.
          </p>
        </section>

        <section className="profile__card profile__card--full">
          <div className="profile__card-header">
            <SectionLabel>Active nudges</SectionLabel>
            <button
              className="profile__add-btn"
              onClick={() => setShowAddNudge(true)}
            >
              + Add nudge
            </button>
          </div>

          {showAddNudge && (
            <div className="profile__add-form">
              <input
                className="profile__add-input"
                placeholder="Nudge title"
                value={newNudge.title}
                onChange={(e) =>
                  setNewNudge({ ...newNudge, title: e.target.value })
                }
              />
              <input
                className="profile__add-input"
                placeholder="Nudge message"
                value={newNudge.body}
                onChange={(e) =>
                  setNewNudge({ ...newNudge, body: e.target.value })
                }
              />
              <select
                className="profile__add-input"
                value={newNudge.type}
                onChange={(e) =>
                  setNewNudge({ ...newNudge, type: e.target.value })
                }
              >
                <option value="warning">Warning</option>
                <option value="success">Success</option>
              </select>
              <div className="profile__add-actions">
                <button className="profile__add-save" onClick={handleAddNudge}>
                  Save
                </button>
                <button
                  className="profile__add-cancel"
                  onClick={() => setShowAddNudge(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="profile__nudges">
            {user.nudges.map((nudge) => (
              <NudgeRow
                key={nudge.id}
                nudge={nudge}
                onUpdate={updateNudge}
                onRemove={removeNudge}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
