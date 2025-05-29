import React, { useCallback, useEffect, useRef, useState } from "react";
import { FloatWindowPropInterface, UpdateStatusInterface } from "./FloatWindowPropInterface";

export function FloatWindowWithoutTitle({
  WindowInitialData,
  onUpdateStatus,
  children,
  isRelative,
}: {
  WindowInitialData: FloatWindowPropInterface;
  onUpdateStatus: (data: UpdateStatusInterface) => void;
  children: React.ReactNode;
  isRelative: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const getScaleFromParent = (parent: HTMLElement) => {
    const style = window.getComputedStyle(parent);
    const transform = style.transform;

    if (transform === "none") return { scaleX: 1, scaleY: 1 };

    const match = transform.match(/^matrix\(([^)]+)\)$/);
    if (match) {
      const values = match[1].split(",").map(parseFloat);
      return {
        scaleX: values[0], // a
        scaleY: values[3], // d
      };
    }

    return { scaleX: 1, scaleY: 1 };
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button !== 0 || !windowRef.current) return;

    const windowRect = windowRef.current.getBoundingClientRect();
    setIsDragging(true);

    setDragStartOffset({
      x: e.clientX - windowRect.left,
      y: e.clientY - windowRect.top,
    });

    document.body.classList.add("user-select-none");
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !windowRef.current) return;

      const parent = windowRef.current.offsetParent as HTMLElement;
      const parentRect = parent?.getBoundingClientRect() || { left: 0, top: 0, width: 1, height: 1 };
      const { scaleX, scaleY } = getScaleFromParent(parent);

      const relativeX = (e.clientX - parentRect.left - dragStartOffset.x) / scaleX;
      const relativeY = (e.clientY - parentRect.top - dragStartOffset.y) / scaleY;

      onUpdateStatus({
        id: WindowInitialData.id,
        isOpen: WindowInitialData.isOpen,
        width: WindowInitialData.width,
        height: WindowInitialData.height,
        posX: relativeX,
        posY: relativeY,
      });
    },
    [isDragging, dragStartOffset, WindowInitialData, onUpdateStatus]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove("user-select-none");
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.classList.remove("user-select-none");
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!WindowInitialData.isOpen) return null;

  return (
    <div
      ref={windowRef}
      className="z-8888 border border-gray-300 shadow-lg rounded-md overflow-hidden"
      style={{
        position: isRelative ? "absolute" : "fixed", // ✅ 修复 display 写错为 position
        width: `${WindowInitialData.width}px`,
        height: `${WindowInitialData.height}px`,
        left: `${WindowInitialData.posX}px`,
        top: `${WindowInitialData.posY}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}
