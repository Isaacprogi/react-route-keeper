import { useEffect, useRef } from "react";
import React from "react";
import type { TrackableElementProps } from "../utils/type";

export const TrackableElement: React.FC<TrackableElementProps> = ({
  onMounted,
  path,
  children,
  enabled = false,
}) => {
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    startTime.current = Date.now();

    return () => {
      if (!enabled || startTime.current === null) return;

      const endTime = Date.now();
      const loadTime = endTime - startTime.current;

      onMounted?.({
        path,
        loadTime,
        timestamp: new Date().toISOString(),
      });

      startTime.current = null;
    };
  }, [enabled, path, onMounted]);

  return <>{children}</>;
};
