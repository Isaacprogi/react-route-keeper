import { useEffect, useRef } from "react";
import type { TrackableElementProps } from "../utils/type";
import React from "react";

export const TrackableElement: React.FC<TrackableElementProps> = ({
  onMounted,
  path,
  children,
  enabled,
}) => {
  const startTime = useRef(Date.now());
  useEffect(() => {
    {
      if (enabled === true) {
        const endTime = Date.now();
        const loadTime = endTime - startTime.current;

        onMounted?.({
          path,
          loadTime,
          timestamp: new Date().toISOString(),
        });

        startTime.current = Date.now();
      }
    }
  }, [onMounted, path,enabled]);

  return <>{children}</>;
};
