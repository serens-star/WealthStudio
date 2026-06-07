import { useState } from "react";
import "./StudioExplainer.css";

export default function StudioExplainer({ title, sections }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="studio-explainer">
      <button
        className="studio-explainer__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="studio-explainer__toggle-icon">
          {open ? "−" : "+"}
        </span>
        <span>
          {open ? "Hide" : "How this works"} — {title}
        </span>
      </button>

      {open && (
        <div className="studio-explainer__body">
          {sections.map((section, i) => (
            <div key={i} className="studio-explainer__section">
              <p className="studio-explainer__section-title">
                {section.heading}
              </p>
              <p className="studio-explainer__section-body">{section.body}</p>
              {section.items && (
                <ul className="studio-explainer__list">
                  {section.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
