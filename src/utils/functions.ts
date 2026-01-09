import type { devWarnProps, RouteConfig } from "../utils/type";
import React from "react";
import type { ValidateRouteParams } from "../utils/type";


export function isLazyElement(
  node: React.ReactNode
): node is React.ReactElement {
  return (
    React.isValidElement(node) &&
    (node.type as any)?.$$typeof === Symbol.for("react.lazy")
  );
}

export function routesUseRoles(routes: RouteConfig[]): boolean {
  return routes.some((r) =>
    Boolean(
      (r.roles && r.roles.length > 0) ||
      (r.children && routesUseRoles(r.children))
    )
  );
}

const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

export const getFullPath = ({ path, index }: { path: string | undefined, index: boolean | undefined }, parentPath = "") => {
  let fullPath = "";
  if (index) {
    fullPath = parentPath || "/";
  } else if (path) {
    fullPath = parentPath + (path.startsWith("/") ? path : "/" + path);
  } else {
    fullPath = parentPath || "/";
  }
  return normalize(fullPath)

};


export function devWarn({ message, disableErrorBoundary }: devWarnProps) {
  if (import.meta.env.NODE_ENV === "development") {
    console.warn(message);
    if (disableErrorBoundary === false) {
      throw new Error(message);
    }
  }
}



export function validateRouteConfig(
  params: ValidateRouteParams
): string[] {
  const issues: string[] = [];

  if (params.element && params.redirectTo) {
    issues.push(
      `Route at path="${params.path}" cannot have both "element" and "redirectTo".`
    );
  }
  
  if (!params.element && !params.redirectTo) {
    issues.push(
      `Route at path="${params.path}" must provide at least an "element" or "redirectTo".`
    );
  }

  if (params.index && params.path) {
    issues.push(`Index route must not define a "path".`);
  }

  if (params.type && !["private", "public", "neutral"].includes(params.type)) {
    issues.push(
      `Invalid route type "${params.type}" at path="${params.path}". Expected "private", "public", or "neutral".`
    );
  }

  if (params.redirectTo && params.children?.length) {
    issues.push(`Redirect route "${params.path}" should not have children.`);
  }

  if (
    params.redirectTo !== undefined &&
    (!params.redirectTo.pathname || params.redirectTo.pathname.trim() === "")
  ) {
    issues.push(`redirectTo.pathname cannot be empty.`);
  }

  if (
    params.path === "/" &&
    (params.type === "public" || params.type === "private" || params.type === "neutral")
  ) {
    issues.push(
      `Root "/" does not need a type. It is handled differently. Please refer docs`
    );
  }
  
  if (params.path && params.redirectTo?.pathname && params.path === params.redirectTo?.pathname) {
    issues.push(`redirectTo and path can't have the same route.`);
  }

  if (params.path === "" && (params.element || params.redirectTo?.pathname)) {
    issues.push(
      `A route with an element or redirect must define a valid "path".`
    );
  }

  return issues;
}

export function validateRouteConfigWithErrorBoundary(
  params: ValidateRouteParams
): string[] {
  const issues = validateRouteConfig(params);
    issues.forEach(issue => {

      devWarn({
        message: `[Route Validation] ${issue}`,
        disableErrorBoundary: params.disableErrorBoundary
      });
    });

  
  return issues;
}