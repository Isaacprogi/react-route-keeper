import React, {  type ReactNode,type ErrorInfo } from "react";
import styles from "../styles/ErrorBoundary.module.css";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        // 2. Use styles object instead of string literals
        <div className={styles["eb-full-page"]}>
          {/* Left Side: Human Interaction */}
          <aside className={styles["eb-sidebar"]}>
            {/* <div className={styles["eb-status-tag"]}>System Alert</div> */}
            <h1 className={styles["eb-hero-title"]}>R-Keeper</h1>
            <p className={styles["eb-description"]}>
              The application encountered a critical exception. We've captured the diagnostics 
              to the right to help resolve the issue.
            </p>
            
            <div className={styles["eb-actions"]}>
              <button onClick={() => window.location.reload()} className={styles["eb-btn-main"]}>
                Refresh Interface
              </button>
              <button onClick={() => window.location.href = '/'} className={styles["eb-btn-outline"]}>
                Return Home
              </button>
            </div>

            <div className={styles["eb-footer-note"]}>
              {/* Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} */}
            </div>
          </aside>

          {/* Right Side: Technical Data Spread */}
          <main className={styles["eb-main-content"]}>
            <section className={styles["eb-section"]}>
              <label>Exception Message</label>
              <div className={styles["eb-message-box"]}>
                {this.state.error?.message || "Internal Application Error"}
              </div>
            </section>

            {/* 3. Handling multiple classes */}
            <section className={`${styles["eb-section"]} ${styles["eb-flex-grow"]}`}>
              <label>Stack Diagnostics</label>
              <div className={styles["eb-stack-container"]}>
                <pre>{this.state.error?.stack || "No stack trace available."}</pre>
              </div>
            </section>

            <section className={styles["eb-grid-details"]}>
              <div className={styles["eb-detail-item"]}>
                <label>Environment</label>
                <span>{import.meta.env.NODE_ENV}</span>
              </div>
              <div className={styles["eb-detail-item"]}>
                <label>Component Trace</label>
                <span>{this.state.errorInfo?.componentStack ? "Captured" : "N/A"}</span>
              </div>
            </section>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}