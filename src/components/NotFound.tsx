import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/NotFound.module.css";

export const NotFound: React.FC = () => {
  return (
    <div className={styles["not-found-container"]}>
      <h1 className={styles["not-found-title"]}>404</h1>

      <div className={styles["not-found-card"]}>
        <h2>Oops! Page Not Found</h2>
        <p>The page you are looking for doesn’t exist or has been moved.</p>

        <div className={styles["not-found-buttons"]}>
          <Link to="/" className={styles["home-button"]}>
            Go Home
          </Link>
          <Link to="/contact" className={styles["contact-button"]}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};