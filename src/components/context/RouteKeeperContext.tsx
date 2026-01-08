import React from "react";
import type { RouteTiming } from "../../utils/type";

type RouteKeeperContextType = {
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
  issues: string[];
  setIssues: React.Dispatch<React.SetStateAction<string[]>>;
  testingMode:boolean;
  toggleTestingMode:()=>void;
};

export const RouteKeeperContext =
  React.createContext<RouteKeeperContextType | null>(null);

export const useRouteKeeper = () => {
  const ctx = React.useContext(RouteKeeperContext);
  if (!ctx) throw new Error("useRouteKeeper must be used within RouteKeeper");
  return ctx;
};
