import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/UnAuthorized.module.css";

export const Unauthorized: React.FC = () => {
  return (
    <div className={styles["unauthorized-container"]}>
      <h1 className={styles["unauthorized-title"]}>401</h1>

      <div className={styles["unauthorized-card"]}>
        <h2>Unauthorized Access</h2>
        <div className={styles["unauthorized-buttons"]}>
          <Link to="/">Go Home</Link>
        </div>
      </div>
    </div>
  );
};