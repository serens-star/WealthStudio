import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { BarChart2, Target, FlaskConical, BookOpen } from "lucide-react";
import "./Onboarding.css";

const steps = [
  {
    id: "welcome",
    title: "Let's set up your financial picture",
    subtitle:
      "This takes about 2 minutes. Your answers personalise your Money Snapshot, strategy track, and spending forecast.",
  },
  {
    id: "income",
    title: "What is your monthly income?",
    subtitle:
      "Enter your gross salary — before tax. We'll calculate your take-home pay automatically using SARS tax tables.",
  },
  {
    id: "spending",
    title: "How does your money flow each month?",
    subtitle:
      "Rough estimates are fine. You can update these anytime from your Profile.",
  },
  {
    id: "track",
    title: "Which path fits your life right now?",
    subtitle:
      "Your track shapes your milestones, nudges, and recommendations. You can switch at any time.",
  },
  {
    id: "goal",
    title: "What is your most important financial goal right now?",
    subtitle: "This becomes your first goal on your Money Snapshot.",
  },
];

const trackOptions = [
  {
    id: "debt-first",
    name: "Debt First",
    desc: "I have student loans, car finance, or credit card debt I want to clear first.",
    colour: "#a50000",
  },
  {
    id: "balanced-growth",
    name: "Balanced Growth",
    desc: "I want to pay down debt while saving and investing at the same time.",
    colour: "#8586fe",
  },
  {
    id: "aggressive-invest",
    name: "Aggressive Investment",
    desc: "My debt is manageable — I want to maximise wealth-building early.",
    colour: "#3db87a",
  },
];

const goalOptions = [
  { id: "emergency", label: "Build an emergency fund", target: 20000 },
  { id: "debt", label: "Pay off high-interest debt", target: 50000 },
  { id: "property", label: "Save for a property deposit", target: 120000 },
  { id: "invest", label: "Start investing consistently", target: 36000 },
  { id: "car", label: "Save for a car deposit", target: 30000 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateUser, updateSpending, updateSaContext } = useUser();

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    grossSalary: "",
    housing: "",
    mobility: "",
    lifestyle: "",
    debt: "",
    savings: "",
    track: "",
    goal: "",
  });
  const [errors, setErrors] = useState({});

  const currentStep = steps[step];

  const set = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (step === 1) {
      if (!data.grossSalary || Number(data.grossSalary) < 5000) {
        newErrors.grossSalary = "Please enter a valid salary (minimum R5 000)";
      }
    }

    if (step === 2) {
      const total =
        Number(data.housing || 0) +
        Number(data.mobility || 0) +
        Number(data.lifestyle || 0) +
        Number(data.debt || 0) +
        Number(data.savings || 0);

      const gross = Number(data.grossSalary);
      const paye = calculatePAYE(gross);
      const takeHome = gross - paye;

      if (total > takeHome) {
        newErrors.spending = `Your total spending (R ${total.toLocaleString(
          "en-ZA"
        )}) exceeds your estimated take-home pay (R ${Math.round(
          takeHome
        ).toLocaleString("en-ZA")}). Please adjust your figures.`;
      }
    }

    if (step === 3 && !data.track) {
      newErrors.track = "Please choose a track to continue";
    }

    if (step === 4 && !data.goal) {
      newErrors.goal = "Please choose a goal to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePAYE = (gross) => {
    const annual = gross * 12;
    let tax = 0;
    if (annual <= 237100) tax = annual * 0.18;
    else if (annual <= 370500) tax = 42678 + (annual - 237100) * 0.26;
    else if (annual <= 512800) tax = 77362 + (annual - 370500) * 0.31;
    else if (annual <= 673000) tax = 121475 + (annual - 512800) * 0.36;
    else if (annual <= 857900) tax = 179147 + (annual - 673000) * 0.39;
    else if (annual <= 1817000) tax = 251258 + (annual - 857900) * 0.41;
    else tax = 644489 + (annual - 1817000) * 0.45;
    return Math.max(0, (tax - 17235) / 12);
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const gross = Number(data.grossSalary);
    const paye = Math.round(calculatePAYE(gross));
    const takeHome = gross - paye;

    const currentEmail = localStorage.getItem("currentUser");
    const accountData = currentEmail
      ? JSON.parse(localStorage.getItem(currentEmail) || "{}")
      : {};

    const initials = accountData.name
      ? accountData.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

    const selectedGoal = goalOptions.find((g) => g.id === data.goal);

    updateUser({
      name: accountData.name || "User",
      initials,
      email: currentEmail || "",
      grossSalary: gross,
      paye,
      takeHome,
      track:
        trackOptions.find((t) => t.id === data.track)?.name ||
        "Balanced Growth",
      goals: [
        {
          id: 1,
          name: selectedGoal?.label || "Emergency fund",
          current: 0,
          target: selectedGoal?.target || 20000,
        },
      ],
      categories: [
        {
          id: "housing",
          label: "Housing",
          amount: Number(data.housing) || 0,
          color: "#a50000",
          description: "Rent, levies, utilities",
        },
        {
          id: "mobility",
          label: "Mobility",
          amount: Number(data.mobility) || 0,
          color: "#8586fe",
          description: "Car repayment, insurance, fuel",
        },
        {
          id: "lifestyle",
          label: "Lifestyle",
          amount: Number(data.lifestyle) || 0,
          color: "#e8a838",
          description: "Food, dining, subscriptions, entertainment",
        },
        {
          id: "debt",
          label: "Debt",
          amount: Number(data.debt) || 0,
          color: "#e05c5c",
          description: "Credit card, personal loan repayments",
        },
        {
          id: "savings",
          label: "Savings",
          amount: Number(data.savings) || 0,
          color: "#3db87a",
          description: "Emergency fund, TFSA, investments",
        },
      ],
    });

    localStorage.setItem("selectedTrack", data.track);
    localStorage.setItem("onboardingComplete", "true");
    navigate("/");
  };

  const gross = Number(data.grossSalary) || 0;
  const paye = Math.round(calculatePAYE(gross));
  const takeHome = gross - paye;

  const totalSpending =
    Number(data.housing || 0) +
    Number(data.mobility || 0) +
    Number(data.lifestyle || 0) +
    Number(data.debt || 0) +
    Number(data.savings || 0);

  const remaining = takeHome - totalSpending;

  return (
    <div className="onboarding">
      <div className="onboarding__nav">
        <div className="onboarding__brand">
          <div className="onboarding__brand-mark">NW</div>
          <span>NextGen Wealth</span>
        </div>
        <button
          className="onboarding__skip"
          onClick={() => {
            localStorage.setItem("onboardingComplete", "true");
            navigate("/");
          }}
        >
          Skip for now
        </button>
      </div>

      <div className="onboarding__progress">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`onboarding__progress-step ${
              i < step
                ? "onboarding__progress-step--done"
                : i === step
                ? "onboarding__progress-step--active"
                : ""
            }`}
          />
        ))}
      </div>

      <div className="onboarding__body">
        <div className="onboarding__card">
          <div className="onboarding__step-label">
            Step {step + 1} of {steps.length}
          </div>
          <h1 className="onboarding__title">{currentStep.title}</h1>
          <p className="onboarding__subtitle">{currentStep.subtitle}</p>

          {step === 0 && (
            <div className="onboarding__welcome">
              <div className="onboarding__welcome-grid">
                {[
                  {
                    icon: BarChart2,
                    label: "Money Snapshot",
                    desc: "Your financial picture at a glance",
                  },
                  {
                    icon: Target,
                    label: "Strategy Track",
                    desc: "A five-year plan built for your life",
                  },
                  {
                    icon: FlaskConical,
                    label: "Simulation Studio",
                    desc: "Test decisions before you make them",
                  },
                  {
                    icon: BookOpen,
                    label: "Learn",
                    desc: "SA finance explained in plain English",
                  },
                ].map((item) => (
                  <div key={item.label} className="onboarding__welcome-item">
                    <item.icon size={22} className="onboarding__welcome-icon" />
                    <div>
                      <p className="onboarding__welcome-label">{item.label}</p>
                      <p className="onboarding__welcome-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="onboarding__fields">
              <div className="onboarding__field">
                <label>Monthly gross salary (before tax)</label>
                <div className="onboarding__input-wrapper">
                  <span className="onboarding__input-prefix">R</span>
                  <input
                    type="number"
                    placeholder="45 000"
                    value={data.grossSalary}
                    onChange={(e) => set("grossSalary", e.target.value)}
                    className={
                      errors.grossSalary ? "onboarding__input--error" : ""
                    }
                  />
                </div>
                {errors.grossSalary && (
                  <p className="onboarding__field-error">
                    {errors.grossSalary}
                  </p>
                )}
              </div>

              {gross > 0 && (
                <div className="onboarding__tax-preview">
                  <div className="onboarding__tax-row">
                    <span>Gross salary</span>
                    <span>R {gross.toLocaleString("en-ZA")}</span>
                  </div>
                  <div className="onboarding__tax-row onboarding__tax-row--deduction">
                    <span>PAYE deducted (SARS estimate)</span>
                    <span>− R {paye.toLocaleString("en-ZA")}</span>
                  </div>
                  <div className="onboarding__tax-row onboarding__tax-row--total">
                    <span>Estimated take-home</span>
                    <span>
                      R {Math.round(takeHome).toLocaleString("en-ZA")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="onboarding__fields">
              {errors.spending && (
                <div className="onboarding__spending-error">
                  {errors.spending}
                </div>
              )}

              {takeHome > 0 && (
                <div className="onboarding__spending-bar-wrapper">
                  <div className="onboarding__spending-bar">
                    {[
                      { key: "housing", color: "#a50000" },
                      { key: "mobility", color: "#8586fe" },
                      { key: "lifestyle", color: "#e8a838" },
                      { key: "debt", color: "#e05c5c" },
                      { key: "savings", color: "#3db87a" },
                    ].map((cat) => (
                      <div
                        key={cat.key}
                        className="onboarding__spending-bar-segment"
                        style={{
                          flex: Math.max(0, Number(data[cat.key]) || 0),
                          background: cat.color,
                        }}
                      />
                    ))}
                    {remaining > 0 && (
                      <div
                        className="onboarding__spending-bar-segment"
                        style={{
                          flex: remaining,
                          background: "var(--color-border)",
                        }}
                      />
                    )}
                  </div>
                  <div className="onboarding__spending-remaining">
                    {remaining >= 0
                      ? `R ${Math.round(remaining).toLocaleString(
                          "en-ZA"
                        )} unallocated`
                      : `R ${Math.abs(Math.round(remaining)).toLocaleString(
                          "en-ZA"
                        )} over budget`}
                  </div>
                </div>
              )}

              {[
                {
                  key: "housing",
                  label: "Housing",
                  placeholder: "9 500",
                  hint: "Rent, levies, utilities",
                },
                {
                  key: "mobility",
                  label: "Mobility",
                  placeholder: "7 200",
                  hint: "Car repayment, insurance, fuel",
                },
                {
                  key: "lifestyle",
                  label: "Lifestyle",
                  placeholder: "6 800",
                  hint: "Food, dining, subscriptions, entertainment",
                },
                {
                  key: "debt",
                  label: "Debt repayments",
                  placeholder: "3 100",
                  hint: "Credit card, personal loans",
                },
                {
                  key: "savings",
                  label: "Savings & investments",
                  placeholder: "3 200",
                  hint: "Emergency fund, TFSA, ETFs",
                },
              ].map((field) => (
                <div key={field.key} className="onboarding__field">
                  <label>
                    {field.label}
                    <span className="onboarding__field-hint">{field.hint}</span>
                  </label>
                  <div className="onboarding__input-wrapper">
                    <span className="onboarding__input-prefix">R</span>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={data[field.key]}
                      onChange={(e) => set(field.key, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="onboarding__tracks">
              {errors.track && (
                <p className="onboarding__field-error">{errors.track}</p>
              )}
              {trackOptions.map((track) => (
                <button
                  key={track.id}
                  className={`onboarding__track-option ${
                    data.track === track.id
                      ? "onboarding__track-option--selected"
                      : ""
                  }`}
                  onClick={() => set("track", track.id)}
                  style={{
                    "--track-colour": track.colour,
                  }}
                >
                  <div
                    className="onboarding__track-dot"
                    style={{ background: track.colour }}
                  />
                  <div className="onboarding__track-content">
                    <p className="onboarding__track-name">{track.name}</p>
                    <p className="onboarding__track-desc">{track.desc}</p>
                  </div>
                  {data.track === track.id && (
                    <span className="onboarding__track-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="onboarding__goals">
              {errors.goal && (
                <p className="onboarding__field-error">{errors.goal}</p>
              )}
              {goalOptions.map((goal) => (
                <button
                  key={goal.id}
                  className={`onboarding__goal-option ${
                    data.goal === goal.id
                      ? "onboarding__goal-option--selected"
                      : ""
                  }`}
                  onClick={() => set("goal", goal.id)}
                >
                  <div className="onboarding__goal-content">
                    <p className="onboarding__goal-label">{goal.label}</p>
                    <p className="onboarding__goal-target">
                      Target: R {goal.target.toLocaleString("en-ZA")}
                    </p>
                  </div>
                  {data.goal === goal.id && (
                    <span className="onboarding__goal-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="onboarding__actions">
            {step > 0 && (
              <button
                className="onboarding__back"
                onClick={() => setStep((s) => s - 1)}
              >
                ← Back
              </button>
            )}
            <button className="onboarding__next" onClick={handleNext}>
              {step === steps.length - 1
                ? "Set up my dashboard →"
                : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
