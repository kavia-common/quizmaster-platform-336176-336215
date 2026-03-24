import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Alert, Card, Field } from "../components/Ui";

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login screen for existing users. */
  const { actions, error, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [busy, setBusy] = useState(false);

  const from = location.state?.from || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError({ message: "Email and password are required." });
      return;
    }

    setBusy(true);
    const res = await actions.login(email, password);
    setBusy(false);

    if (res.ok) navigate(from, { replace: true });
  };

  return (
    <div className="container narrow">
      <Card title="Log in" subtitle="Access your account and admin tools (if permitted).">
        {status === "authenticated" ? (
          <Alert kind="success" title="You are already logged in">
            Go to <Link to="/">home</Link>.
          </Alert>
        ) : null}

        {localError ? <Alert kind="error" title="Fix the form">{localError.message}</Alert> : null}
        {error ? (
          <Alert kind="error" title="Login failed">
            <pre className="codeBlock">{JSON.stringify(error, null, 2)}</pre>
          </Alert>
        ) : null}

        <form className="form" onSubmit={onSubmit}>
          <Field label="Email">
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" />
          </Field>
          <Field label="Password">
            <input className="input" value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="current-password" />
          </Field>
          <button className="btn btnBlock" disabled={busy} type="submit">
            {busy ? "Logging in…" : "Log in"}
          </button>
          <p className="muted">
            No account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
