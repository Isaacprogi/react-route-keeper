import React from "react";
import styles from "../styles/LoadingScreen.module.css";

export const LoadingScreen: React.FC = () => (
  <div className={styles["loading-screen"]}>
    <div className={styles.spinner}></div>
    <p className={styles["loading-text"]}>Loading, please wait...</p>
  </div>
);