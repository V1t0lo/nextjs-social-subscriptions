"use client";

import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ToggleActionButtonProps {
  active: boolean;
  onToggleAction: (newState: boolean) => Promise<boolean>;
  activeText: string;
  inactiveText: string;
}

export default function ToggleActionButton({
  active,
  onToggleAction,
  activeText,
  inactiveText,
}: ToggleActionButtonProps) {
  const [isActive, setIsActive] = useState(active);
  const [loading, setLoading] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  const handleClick = async () => {
    if (loading) return;

    const newState = !isActive;
    setLoading(true);

    const result = await onToggleAction(newState);

    if (result === newState) {
      setIsActive(newState);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 1500);
    }

    setLoading(false);
  };

  const baseClasses =
    "px-4 py-2 rounded-full border text-sm font-medium min-w-[120px] h-10 transition-all duration-200 text-center flex items-center justify-center";

  const activeClasses = isActive
    ? "bg-purple-100 border-purple-700 text-purple-700 hover:bg-purple-200"
    : "bg-purple-700 border-purple-300 text-white hover:bg-purple-800";

  const disabledClasses =
    "opacity-80 cursor-not-allowed bg-purple-200 border-purple-300 text-purple-700";

  const buttonClasses =
    loading || showCheck
      ? `${baseClasses} ${disabledClasses}`
      : `${baseClasses} ${activeClasses}`;

  return (
    <button onClick={handleClick} disabled={loading} className={buttonClasses}>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : showCheck ? (
        <Check className="w-5 h-5 text-green-500 transition-all duration-300" />
      ) : (
        <span>{isActive ? activeText : inactiveText}</span>
      )}
    </button>
  );
}
