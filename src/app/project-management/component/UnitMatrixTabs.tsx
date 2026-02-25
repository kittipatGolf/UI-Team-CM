"use client";

import { useMemo, useState } from "react";

export type UnitMatrixTabKey =
  | "unit_matrix"
  | "qc5"
  | "qc6"
  | "rem"
  | "qc05"
  | "site_walk";

export type UnitMatrixTab = {
  key: UnitMatrixTabKey;
  label: string;
};

type Props = {
  value?: UnitMatrixTabKey;
  onChange?: (key: UnitMatrixTabKey) => void;
};

const DEFAULT_TABS: UnitMatrixTab[] = [
  { key: "unit_matrix", label: "Unit Matrix" },
  { key: "qc5", label: "การตรวจ QC5" },
  { key: "qc6", label: "QC6" },
  { key: "rem", label: "การตรวจ REM" },
  { key: "qc05", label: "การตรวจ 0.5" },
  { key: "site_walk", label: "Site Walk" },
];

export default function UnitMatrixTabs({ value, onChange }: Props) {
  const tabs = useMemo(() => DEFAULT_TABS, []);
  const [inner, setInner] = useState<UnitMatrixTabKey>("unit_matrix");

  const active = value ?? inner;

  const setActive = (k: UnitMatrixTabKey) => {
    if (onChange) onChange(k);
    else setInner(k);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-fit rounded-lg bg-white p-4">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {tabs.map((t) => {
            const isActive = t.key === active;

            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={[
                  "min-w-[160px] rounded-md border px-4 py-2 text-[14px] font-normal transition",
                  isActive
                    ? "border-slate-500 bg-white text-slate-900"
                    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}