import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { currentUser } from "../../data/userData";
import "./Login.css";

export default function Login({ onLogin }) {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const stored = localStorage.getItem(formData.email);

      if (!stored) {
        setError("No account found with that email.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(stored);

      if (user.password !== formData.password) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("currentUser", formData.email);
      if (onLogin) onLogin(); // ← guard so it never throws if prop is missing
      navigate("/");
    }, 600);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand__mark">NW</div>
          <span className="login-brand__name">NextGen Wealth</span>
        </div>

        <div className="login-header">
          <h1 className="login-header__title">Welcome back!</h1>
          <p className="login-header__sub">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="login-field">
            <label htmlFor="email" className="login-field__label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="login-field__input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-field__label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="login-field__input"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-footer__link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
