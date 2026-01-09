import React from "react";

export type RouteType = "public" | "private" | "neutral";

export interface RedirectTo {
  pathname: string;
  search?: string;
  hash?: string;
  state?: any;
  replace?: boolean;
  relative?: "route" | "path";
  preventScrollReset?: boolean;
}

export type RenderRoute = {
  element: React.ReactNode;
  redirectTo?: never;
  fallback?: never;
};

export type RedirectRoute = {
  redirectTo: RedirectTo;
  element?: never;
  fallback?: never;
};


export type IndexRouteConfig = {
  index: true;
  path?: never;
  children?: never;
};

export type PathRouteConfig = {
  path: string;
  index?: false;
  children?: RouteConfig[];
};


export type RouteConfig =
  (RenderRoute | RedirectRoute) &
  (IndexRouteConfig | PathRouteConfig) &
  {
    type?: RouteType;
    roles?: string[];
    caseSensitive?: boolean;
    excludeParentRole?: boolean;
  };

export interface RouteGuardProps {
  routes: RouteConfig[];
  auth: boolean | string;
  userRoles?: string[];
  loading: boolean;
  loadingScreen?: React.ReactNode;
  privateRedirect: string;
  publicRedirect?: string;
  privateFallback?: React.ReactNode;
  unAuthorized?: React.ReactNode;
  notFound?: React.ReactNode;
  disableErrorBoundary?: boolean;
  setRemoveErrorBoundary?: React.Dispatch<React.SetStateAction<boolean>>;
  onRouteChange?: (location: string) => void;
  onRedirect?: (from: string, to: string) => void;
  visualizer?: {
    enabled?: boolean;
    render?: () => React.ReactElement<RouteVisionProps, string | React.JSXElementConstructor<any>>;
  };
}

export interface RouteVisionProps {
  routes: RouteConfig[];
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
  issues: string[]
  setIssues: React.Dispatch<React.SetStateAction<string[]>>
  testingMode:boolean;
  toggleTestingMode:()=>void;
  auth:boolean;
};




// visualizer/types.ts

export type VisualRouteNode = {
  id: string;
  path?: string;
  fullPath: string;
  index?: boolean;
  type: "private" | "public" | "neutral";
  roles: string[];
  inheritedRoles: string[];
  redirectTo?: RedirectTo;
  lazy: boolean;
  children: VisualRouteNode[];
};

// simulationTypes.ts
export type RouteOutcome =
  | { type: "render" }
  | { type: "redirect"; to: string }
  | { type: "unauthorized" }
  | { type: "fallback" };

export interface SimulationContext {
  label: string;
  auth: boolean;
  userRoles: string[];
}

export interface SimulationResult {
  path: string;
  context: SimulationContext;
  outcome: RouteOutcome;
}

export type Scenario = {
  label: string; // "Guest", "User", "Viewer", "Admin"
  results: {
    route: string;
    access: "allow" | "redirect" | "deny";
  }[];
};


export interface RouteTiming {
  path: string;
  intendedPath?: string;
  loadTime: number;
  redirected?: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TrackableElementProps {
  onMounted?: (timing: RouteTiming) => void;
  path: string;
  children: React.ReactNode;
  enabled:boolean;
}

export type devWarnProps = {
  message: string;
  disableErrorBoundary?: boolean;
};



export interface ValidateRouteParams {
  path?: string;
  element?: React.ReactNode;
  redirectTo?: RedirectTo;
  index?: boolean;
  type?: string;
  children?: ValidateRouteParams[];
  disableErrorBoundary?: boolean;
}
