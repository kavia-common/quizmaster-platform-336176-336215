import React from "react";

// PUBLIC_INTERFACE
export function Alert({ kind = "info", title, children }) {
  /** Renders an alert box. kind: info|error|success|warning */
  const cls = kind === "error" ? "alert alertError"
    : kind === "success" ? "alert alertSuccess"
    : kind === "warning" ? "alert alertWarning"
    : "alert";
  return (
    <div className={cls} role={kind === "error" ? "alert" : "status"}>
      {title ? <div className="alertTitle">{title}</div> : null}
      <div className="alertBody">{children}</div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Field({ label, hint, error, children }) {
  /** Form field wrapper with label, hint and error. */
  return (
    <label className="field">
      <span className="fieldLabel">{label}</span>
      {children}
      {hint ? <span className="fieldHint">{hint}</span> : null}
      {error ? <span className="fieldError">{error}</span> : null}
    </label>
  );
}

// PUBLIC_INTERFACE
export function Card({ title, subtitle, actions, children }) {
  /** Standard card container. */
  return (
    <section className="card">
      {(title || subtitle || actions) ? (
        <div className="cardHeader">
          <div>
            {title ? <h2 className="cardTitle">{title}</h2> : null}
            {subtitle ? <p className="cardSubtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="cardActions">{actions}</div> : null}
        </div>
      ) : null}
      <div className="cardBody">{children}</div>
    </section>
  );
}
