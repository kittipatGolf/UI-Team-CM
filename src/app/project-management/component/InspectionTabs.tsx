"use client";

import { useMemo, useState } from "react";

export type InspectionTabKey =
  | "unit"
  | "common_area"
  | "zone"
  | "pile_footing"
  | "steel_structure";

export type InspectionTab = {
  key: InspectionTabKey;
  label: string;
};

type Props = {
  value?: InspectionTabKey;
  onChange?: (key: InspectionTabKey) => void;
};

const DEFAULT_TABS: InspectionTab[] = [
  { key: "unit", label: "Unit" },
  { key: "common_area", label: "Common-Area" },
  { key: "zone", label: "Zone" },
  { key: "pile_footing", label: "Pile + Footing" },
  { key: "steel_structure", label: "Steel Structure" },
];

export default function InspectionTabs({ value, onChange }: Props) {
  const tabs = useMemo(() => DEFAULT_TABS, []);
  const [inner, setInner] = useState<InspectionTabKey>("unit");

  const active = value ?? inner;

  const setActive = (k: InspectionTabKey) => {
    if (onChange) onChange(k);
    else setInner(k);
  };

  return (
    <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
      {tabs.map((t) => {
        const isActive = t.key === active;

        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={[
              "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#184777] text-white border-[#184777] hover:bg-[#184777] hover:border-[#184777]"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-300",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}