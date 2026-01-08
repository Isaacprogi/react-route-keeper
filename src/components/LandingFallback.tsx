import React from "react";
import styles from "../styles/LandingFallback.module.css";

export const LandingFallback: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
    

        <h1 className={styles.title}>Welcome to Route Keeper</h1>

        <p className={styles.description}>
          Next, provide your landing page or any custom component to the{" "}
          <code className={styles.code}>privateFallback</code> prop to replace this default page.
        </p>
        
        <span className={styles.italicText}>
          Happy Routing 😊👌
        </span>
        
        <a
          href="https://isaacprogi.github.io/routekeeper/docs"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.docsLink}
        >
          Docs
        </a>
      </div>
    </div>
  );
};