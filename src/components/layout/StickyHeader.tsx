// components/layout/StickyHeader.tsx
"use client";

import React from "react";

type StickyHeaderProps = {
  title: string;
  leftButton?: React.ReactNode;
  rightButtons?: React.ReactNode[];
};

export default function StickyHeader({
  title,
  leftButton,
  rightButtons = [],
}: StickyHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-50">
      <div className=" mx-auto p-4 flex justify-between items-center border-b border-purple-100">
        <div className="flex items-center gap-4">
          {leftButton}
          <h1 className="text-xl font-bold text-purple-700">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {rightButtons.map((btn, idx) => (
            <span key={idx}>{btn}</span>
          ))}
        </div>
      </div>
    </header>
  );
}
