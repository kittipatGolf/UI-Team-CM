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
              "h-10 whitespace-nowrap rounded-md border px-4 text-[14px] font-normal transition",
              isActive
                ? "bg-[#184777] text-white border-[#184777]"
                : "bg-white text-slate-900 border-slate-300 hover:bg-[#184777] hover:text-white hover:border-[#184777]",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}