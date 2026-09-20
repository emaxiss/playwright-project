import { useState } from "react";
import { AlertIcon } from "./Icons";

export function LoginScreen({
  onSignIn,
}: {
  onSignIn: (username: string, password: string) => Promise<string | null>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const message = await onSignIn(username, password);
    setPending(false);
    setError(message ?? "");
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <div className="auth-mark" aria-hidden="true">
          K
        </div>
        <h1>Sign in to Kanban</h1>
        <p className="auth-lede">
          Track work across your product boards in one place.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          aria-label="Sign in"
        >
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && (
            <p className="field-error" role="alert">
              <AlertIcon size={14} />
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-hint">
          Demo credentials: <code>admin</code> / <code>password123</code>
        </p>
      </div>
    </div>
  );
}
