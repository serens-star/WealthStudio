import { useState, useRef, useEffect } from "react";
import "./InlineEdit.css";

export default function InlineEdit({
  value,
  onSave,
  type = "text",
  prefix = "",
  suffix = "",
  className = "",
  displayClassName = "",
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = () => {
    const parsed = type === "number" ? Number(draft) : draft;
    if (parsed !== value) onSave(parsed);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setDraft(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <span className={`inline-edit inline-edit--active ${className}`}>
        {prefix && <span className="inline-edit__prefix">{prefix}</span>}
        <input
          ref={inputRef}
          type={type}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="inline-edit__input"
        />
        {suffix && <span className="inline-edit__suffix">{suffix}</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-edit inline-edit--display ${displayClassName}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {prefix}
      {type === "number" ? Number(value).toLocaleString("en-ZA") : value}
      {suffix}
      <span className="inline-edit__hint">✎</span>
    </span>
  );
}
