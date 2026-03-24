import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Alert, Card, Field } from "../components/Ui";

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Registration screen for new users. */
  const { actions, error, status } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError({ message: "Email and password are required." });
      return;
    }
    if (password.length < 6) {
      setLocalError({ message: "Password must be at least 6 characters." });
      return;
    }

    setBusy(true);
    const res = await actions.register(email, password);
    setBusy(false);

    if (res.ok) navigate("/", { replace: true });
  };

  return (
    <div className="container narrow">
      <Card title="Sign up" subtitle="Create an account to track your progress and access admin tools (if assigned).">
        {status === "authenticated" ? (
          <Alert kind="success" title="You are already signed in">
            Go to <Link to="/">home</Link>.
          </Alert>
        ) : null}

        {localError ? <Alert kind="error" title="Fix the form">{localError.message}</Alert> : null}
        {error ? (
          <Alert kind="error" title="Registration failed">
            <pre className="codeBlock">{JSON.stringify(error, null, 2)}</pre>
          </Alert>
        ) : null}

        <form className="form" onSubmit={onSubmit}>
          <Field label="Email">
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" />
          </Field>
          <Field label="Password" hint="Minimum 6 characters.">
            <input className="input" value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="new-password" />
          </Field>
          <button className="btn btnBlock" disabled={busy} type="submit">
            {busy ? "Creating account…" : "Create account"}
          </button>
          <p className="muted">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
