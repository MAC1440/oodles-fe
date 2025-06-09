"use client";
import React, { useEffect, useRef, useState } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const ClickTooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-2 py-1 bg-amber-600 text-white rounded text-xs cursor-pointer hover:bg-amber-700"
      >
        {children}
      </button>

      {open && (
        <div className="absolute left-1/2 bottom-1 z-20 mt-2 w-48 -translate-x-1/2 rounded bg-emerald-700 text-white text-sm p-4 shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export default ClickTooltip;
