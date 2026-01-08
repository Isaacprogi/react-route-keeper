import React, { useState } from "react";
import type { RouteTiming } from "../../utils/type";

type RouteKeeperContextType = {
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
  issues: string[];
  setIssues: React.Dispatch<React.SetStateAction<string[]>>;
  testingMode: boolean;
  toggleTestingMode: () => void;
};

const RouteKeeperContext =
  React.createContext<RouteKeeperContextType | null>(null);

export const RouteKeeperProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timingRecords, setTimingRecords] = useState<RouteTiming[]>([]);
  const [issues, setIssues] = useState<string[]>([]);

  const [testingMode, setTestingMode] = useState(() => {
    const stored = localStorage.getItem("rk_testingMode");
    return stored === "true"; 
  });

  const toggleTestingMode = () => {
    setTestingMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("rk_testingMode", String(newValue));
      return newValue;
    });
  };

  return (
    <RouteKeeperContext.Provider
      value={{ timingRecords, setTimingRecords, issues, setIssues, testingMode, toggleTestingMode }}
    >
      {children}
    </RouteKeeperContext.Provider>
  );
};

export const useRouteKeeper = () => {
  const ctx = React.useContext(RouteKeeperContext);
  if (!ctx) {
    throw new Error("useRouteKeeper must be used within RouteKeeperProvider");
  }
  return ctx;
};
