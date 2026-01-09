import React, { useState, useRef, useEffect } from "react";
import Logo from "../asset/logo.jpg";
import type { RouteVisionProps } from "../utils/type";
import type { RouteTiming } from "../utils/type";

type LauncherButtonProps = {
  plugEditor: () => React.ReactElement<RouteVisionProps>;
  editorWidth?: number;
  editorHeight?: number;
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
  issues: string[];
  setIssues: React.Dispatch<React.SetStateAction<string[]>>;
  testingMode: boolean;
  toggleTestingMode: () => void;
};

const STORAGE_OPEN = "rk:editor:open";
const STORAGE_POS = "rk:editor:pos";

export const LauncherButton: React.FC<LauncherButtonProps> = ({
  plugEditor,
  timingRecords,
  setTimingRecords,
  issues,
  setIssues,
  testingMode,
  toggleTestingMode,
}) => {
  const getInitialOpen = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_OPEN) === "true";
  };

  const getInitialPos = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_POS);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [open, setOpen] = useState<boolean>(getInitialOpen);
  const [isDragging, setIsDragging] = useState(false);

  const [buttonPosition, setButtonPosition] = useState<{
    x: number;
    y: number;
  }>(() => getInitialPos() ?? { x: 0, y: 0 });

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonPositionRef = useRef(buttonPosition);

  /* -----------------------------
   * Keep ref updated to avoid stale closures
   * ----------------------------- */
  useEffect(() => {
    buttonPositionRef.current = buttonPosition;
  }, [buttonPosition]);

  /* -----------------------------
   * Persist editor open state
   * ----------------------------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_OPEN, String(open));
    }
  }, [open]);

  /* -----------------------------
   * Default position ONLY if none stored
   * ----------------------------- */
  useEffect(() => {
    if (getInitialPos()) return;

    const buttonSize = 70;
    const margin = 24;

    setButtonPosition({
      x: margin,
      y: window.innerHeight - buttonSize - margin,
    });
  }, []);

  /* -----------------------------
   * Drag move + persist position
   * ----------------------------- */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const buttonSize = 70;
      const maxX = window.innerWidth - buttonSize;
      const maxY = window.innerHeight - buttonSize;

      const newPos = {
        x: Math.max(0, Math.min(e.clientX - dragOffset.x, maxX)),
        y: Math.max(0, Math.min(e.clientY - dragOffset.y, maxY)),
      };

      setButtonPosition(newPos);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        localStorage.setItem(
          STORAGE_POS,
          JSON.stringify(buttonPositionRef.current)
        );
      }
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  /* -----------------------------
   * Combined onMouseDown handler
   * ----------------------------- */
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setIsDragging(true);

    // Apply click style
    e.currentTarget.style.transform = "scale(0.95)";
    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 1)";

    e.preventDefault();
  };

  return (
    <>
      {/* Draggable Button */}
      <button
        ref={buttonRef}
        onClick={() => !isDragging && setOpen((o) => !o)}
        onMouseDown={handleMouseDown}
        style={{
          position: "fixed",
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`,
          zIndex: 1001,
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundImage: `url(${Logo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          boxShadow:
            "0 6px 24px rgba(0, 0, 0, 0.3), 0 12px 40px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
          cursor: isDragging ? "grabbing" : "grab",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          padding: 10,
          transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 8px 32px rgba(0, 0, 0, 0.4), 0 16px 48px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.2)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 6px 24px rgba(0, 0, 0, 0.3), 0 12px 40px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)";
          }
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = isDragging
            ? "scale(1)"
            : "scale(1.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.9)";
        }}
      />

      {/* Editor Overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
          }}
        >
          {plugEditor &&
            React.cloneElement(plugEditor(), {
              timingRecords,
              setTimingRecords,
              issues,
              setIssues,
              testingMode,
              toggleTestingMode,
            })}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: rotate(90deg) scale(1);
          }
          50% {
            opacity: 1;
            transform: rotate(90deg) scale(1.2);
          }
        }
      `}</style>
    </>
  );
};
