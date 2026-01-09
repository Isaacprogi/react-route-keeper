import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import type { RouteConfig, RouteGuardProps, RedirectTo } from "../utils/type";
import { LoadingScreen } from "./LoadingScreen";
import { LandingFallback } from "./LandingFallback";
import { Unauthorized } from "./UnAuthorized";
import { NotFound } from "./NotFound";
import { ErrorBoundary } from "./ErrorBoundary";
import {
  devWarn,
  getFullPath,
  isLazyElement,
  validateRouteConfigWithErrorBoundary,
} from "../utils/functions";
import { LauncherButton } from "./LuncherButton";
import { TrackableElement } from "./TrackableElement";
import type { RouteTiming } from "../utils/type";
import { RouteKeeperContext } from "./context/RouteKeeperContext";
import { useRouteKeeper } from "./context/RouteKeeperContext";

if (import.meta.env.NODE_ENV === "development")
  console.log(
    "%c🔥 RouteKeeper COMPONENT IS MOUNTED 🔥",
    "color: #00f2ff; background: #141417; font-size: 10px; font-weight: bold; padding: 6px 12px; border: 1px solid #26262b; border-left: 4px solid #00f2ff; border-radius: 4px; font-family: 'JetBrains Mono', monospace;"
  );

export const RK: React.FC<RouteGuardProps> = ({
  routes: initialRoutes,
  auth: isAuth,
  userRoles = [],
  loading,
  loadingScreen = <LoadingScreen />,
  publicRedirect = "/",
  privateFallback = <LandingFallback />,
  privateRedirect = "/login",
  notFound = <NotFound />,
  unAuthorized = <Unauthorized />,
  disableErrorBoundary = false,
  setRemoveErrorBoundary,
  onRouteChange,
  onRedirect,
  visualizer,
}) => {
  const auth = typeof isAuth === "string" ? Boolean(isAuth) : isAuth;
  const [routes, _] = useState<RouteConfig[]>(initialRoutes);
  const location = useLocation();
  const { setTimingRecords, setIssues } = useRouteKeeper();
  const enabled = visualizer?.enabled && visualizer.render;

  useEffect(() => {
    setRemoveErrorBoundary?.(disableErrorBoundary);
  }, [disableErrorBoundary]);

  useEffect(() => {
    onRouteChange?.(location.pathname);
  }, [location.pathname, onRouteChange]);

  const onRouteRendered = useCallback(
    (timing: RouteTiming) => {
      const state = location.state as any;
      const enrichedTiming: RouteTiming = {
        ...timing,
        intendedPath: state?.__rkIntendedPath ?? timing.path,
        redirected: Boolean(state?.__rkRedirected),
        timestamp: new Date().toISOString(),
        metadata: {
          guard: state?.__rkGuard,
          reason: state?.__rkReason,
        },
      };
      setTimingRecords((prev) => [enrichedTiming, ...prev]);
    },
    [location.pathname]
  );

  useEffect(() => {
    const collectedIssues: string[] = [];

    const walk = (routes: RouteConfig[], parentKey = "") => {
      const usedPaths = new Set<string>();
      let indexUsed = false;

      for (const route of routes) {
        if (route.index) {
          if (indexUsed) {
            collectedIssues.push(
              `Duplicate index route at parentKey="${
                parentKey === "" ? "/" : parentKey
              }".`
            );
          }
          indexUsed = true;
        }

        if (route.path) {
          if (usedPaths.has(route.path)) {
            collectedIssues.push(
              `Duplicate path "${route.path}" at parentKey="${
                parentKey === "" ? "/" : parentKey
              }".`
            );
          }
          usedPaths.add(route.path);
        }

        collectedIssues.push(
          ...validateRouteConfigWithErrorBoundary({
            ...route,
            disableErrorBoundary,
          })
        );

        if (route.children) {
          walk(
            route.children,
            getFullPath({ path: route.path, index: route.index }, parentKey) ??
              parentKey
          );
        }
      }
    };

    walk(routes);
    setIssues(collectedIssues);
  }, [routes, disableErrorBoundary]);

  if (loading) return loadingScreen;

  const safePrivateRedirect =
    typeof privateRedirect === "string" && privateRedirect.trim() !== ""
      ? privateRedirect
      : "/login";

  const safePublicRedirect =
    typeof publicRedirect === "string" && publicRedirect.trim() !== ""
      ? publicRedirect
      : "/";

  if (!safePublicRedirect) {
    const message = `publicRedirect must be a non-empty string. Received "${publicRedirect}".`;
    setIssues((prev) => [...prev, message]);
    devWarn({
      message,
      disableErrorBoundary,
    });
  }

  const handleRedirect = (
    redirectTo: RedirectTo,
    guard: string,
    reason: string,
    triggerOnredirect = true
  ) => {
    const {
      pathname,
      search,
      hash,
      state,
      replace = true,
      relative,
      preventScrollReset,
    } = redirectTo;
    const to: any = { pathname };
    if (search) to.search = search.startsWith("?") ? search : `?${search}`;
    if (hash) to.hash = hash.startsWith("#") ? hash : `#${hash}`;
    if (state !== undefined) to.state = state;

    
     onRedirect?.(location.pathname, pathname);
    

    return (
      <Navigate
        to={to}
        replace={replace}
        relative={relative}
        {...(preventScrollReset !== undefined ? { preventScrollReset } : {})}
        state={{
          ...state,
          __rkRedirected: true,
          __rkFrom: location.pathname,
          __rkIntendedPath: location.pathname,
          __rkGuard: guard,
          __rkReason: reason,
        }}
      />
    );
  };

  const renderRoutes = (
    routesArray: RouteConfig[],
    parentKey = "",
    inheritedType?: "private" | "public" | "neutral",
    parentRoles: string[] = []
  ): (React.ReactElement | null)[] => {
    return routesArray.map(
      ({
        path,
        element,
        type,
        children,
        index,
        roles,
        redirectTo,
        excludeParentRole,
        ...rest
      }) => {
        const fullPath = getFullPath({ path, index }, parentKey);

        const wrapWithTrackable = (el: React.ReactNode, fullPath: string) => {
          {
            if (location.pathname !== fullPath) {
              return el;
            }

            return (
              <TrackableElement
                enabled={Boolean(enabled)}
                key={fullPath}
                path={fullPath}
                onMounted={onRouteRendered}
              >
                {el}
              </TrackableElement>
            );
          }
        };

        const isLazy = isLazyElement(element);

        const routeType = type || inheritedType || "public";

        const effectiveRoles =
          roles && excludeParentRole
            ? roles
            : [...new Set([...(parentRoles || []), ...(roles || [])])];
        const hasRoleAccess =
          effectiveRoles.length === 0 ||
          userRoles.some((role) => effectiveRoles.includes(role));

        let routeElement: React.ReactNode;

        if (redirectTo) {
          routeElement = handleRedirect(
            redirectTo,
            "RouteKeeper",
            "Redirect configured"
          );
        } else if (path === "/") {
          routeElement = auth
            ? wrapWithTrackable(element, fullPath!)
            : wrapWithTrackable(privateFallback, fullPath!);
        } else {
          let wrappedElement = wrapWithTrackable(element, fullPath!);
          if (isLazy)
            wrappedElement = (
              <Suspense fallback={rest.fallback ?? loadingScreen}>
                {wrappedElement}
              </Suspense>
            );

          switch (routeType) {
            case "private":
              routeElement = !auth
                ? handleRedirect(
                    { pathname: safePrivateRedirect, replace: true },
                    "RouteKeeper",
                    "User not authenticated",
                    false
                  )
                : !hasRoleAccess
                ? wrapWithTrackable(unAuthorized, fullPath!)
                : wrappedElement;
              break;
            case "public":
              routeElement = auth
                ? handleRedirect(
                    { pathname: safePublicRedirect, replace: true },
                    "RouteKeeper",
                    "User already authenticated",
                    false
                  )
                : wrappedElement;
              break;
            case "neutral":
              routeElement = wrappedElement;
              break;
            default:
              routeElement = null;
          }
        }

        const childRoutes = children
          ? renderRoutes(children, fullPath, routeType, effectiveRoles)
          : undefined;

        if (index)
          return (
            <Route
              key={fullPath + "index"}
              index
              element={routeElement}
              {...rest}
            />
          );
        if (children && children.length > 0)
          return (
            <Route
              key={parentKey + path}
              path={path}
              element={routeElement}
              {...rest}
            >
              {childRoutes}
            </Route>
          );
        return (
          <Route
            key={parentKey + path}
            path={path}
            element={routeElement}
            {...rest}
          />
        );
      }
    );
  };

  return (
    <>
      <Routes>
        {renderRoutes(routes)}
        <Route path="*" element={notFound} />
      </Routes>
    </>
  );
};

export const RouteKeeper: React.FC<RouteGuardProps> = (props) => {
  const [removeErrorBoundary, setRemoveErrorBoundary] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [timingRecords, setTimingRecords] = useState<RouteTiming[]>([]);

  const [testingMode, setTestingMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("__rk_testing_mode__") === "true";
  });

  useEffect(() => {
    localStorage.setItem("__rk_testing_mode__", String(testingMode));
  }, [testingMode]);

  const toggleTestingMode = () => {
    setTestingMode((prev) => !prev);
  };

  return (
    <RouteKeeperContext.Provider
      value={{
        timingRecords,
        setTimingRecords,
        issues,
        setIssues,
        testingMode,
        toggleTestingMode,
      }}
    >
      <>
        {props.visualizer?.enabled && props.visualizer.render && (
          <LauncherButton
            timingRecords={timingRecords}
            setTimingRecords={setTimingRecords}
            issues={issues}
            setIssues={setIssues}
            plugEditor={props.visualizer.render}
            testingMode={testingMode}
            toggleTestingMode={toggleTestingMode}
            auth={Boolean(props?.auth)}
          />
        )}

        {removeErrorBoundary ? (
          <RK {...props} setRemoveErrorBoundary={setRemoveErrorBoundary} />
        ) : (
          <ErrorBoundary>
            <RK {...props} setRemoveErrorBoundary={setRemoveErrorBoundary} />
          </ErrorBoundary>
        )}
      </>
    </RouteKeeperContext.Provider>
  );
};
