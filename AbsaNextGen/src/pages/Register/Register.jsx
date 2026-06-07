import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!formData.email.includes("@") || !formData.email.includes(".")) {
    setError("Please enter a valid email address.");
    return;
  }

  if (formData.name.trim().length < 2) {
    setError("Please enter your full name.");
    return;
  }

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (localStorage.getItem(formData.email)) {
      setError("An account with this email already exists.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem(
        formData.email,
        JSON.stringify({
          name: formData.name,
          password: formData.password,
        })
      );
      localStorage.setItem("currentUser", formData.email);
      onLogin();
      navigate("/");
    }, 600);
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-brand">
          <div className="register-brand__mark">NW</div>
          <span className="register-brand__name">NextGen Wealth</span>
        </div>

        <div className="register-header">
          <h1 className="register-header__title">Create your account</h1>
          <p className="register-header__sub">
            Start your first five years right.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div className="register-field">
            <label htmlFor="name" className="register-field__label">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="register-field__input"
              placeholder="Obakeng Ramokgodza"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="register-field">
            <label htmlFor="email" className="register-field__label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="register-field__input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="register-field">
            <label htmlFor="password" className="register-field__label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="register-field__input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="register-field">
            <label htmlFor="confirm" className="register-field__label">
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              className="register-field__input"
              placeholder="Repeat your password"
              value={formData.confirm}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-footer__link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
