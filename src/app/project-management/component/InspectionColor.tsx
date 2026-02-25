"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchProjectSummary } from "../projectService";

type CheckFormItem = {
  order: number;
  checkFormName: string;
  color: string;
};

type Props = {
  projectId: string;
  checkForms?: CheckFormItem[];
  className?: string;
};

function Swatch({ color, bordered }: { color: string; bordered?: boolean }) {
  return (
    <span
      className={[
        "inline-block h-4 w-14 shrink-0 rounded-sm",
        bordered ? "border border-slate-300" : "border border-slate-200",
      ].join(" ")}
      style={{ backgroundColor: color }}
    />
  );
}

export default function InspectionLegend({
  projectId,
  checkForms,
  className = "",
}: Props) {
  const [fetched, setFetched] = useState<CheckFormItem[]>([]);

  useEffect(() => {
    if (checkForms?.length) return;
    if (!projectId) return;

    let alive = true;

    fetchProjectSummary(projectId)
      .then((data) => {
        if (!alive) return;

        const apiList = Array.isArray(data?.checkFormSummary)
          ? data.checkFormSummary
          : [];
        const sortedApi = [...apiList].sort(
          (a, b) => (a?.order ?? 0) - (b?.order ?? 0)
        );
        const mapped: CheckFormItem[] = sortedApi.map((x, idx) => ({
          order: idx + 1,
          checkFormName: x?.checkFormName ?? "-",
          color: x?.color ?? "#e5e7eb",
        }));

        setFetched(mapped);
      })
      .catch(() => {
      });

    return () => {
      alive = false;
    };
  }, [checkForms, projectId]);

  const items = checkForms?.length ? checkForms : fetched;

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => a.order - b.order);
  }, [items]);

  return (
    <div
      className={[
        "w-full rounded-lg border border-slate-200 bg-white p-5",
        className,
      ].join(" ")}
    >
      <div className="flex justify-start gap-3 overflow-x-auto scrollbar-hide">
        <div className="min-w-[72px] whitespace-pre-line text-sm leading-5 text-slate-700">
          สีแถบ{"\n"}สถานะ:
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Swatch color="#ffffff" bordered />
            <span className="text-slate-700">ไม่มีชื่องาน / ยังไม่เริ่ม</span>
          </div>

          <div className="flex items-center gap-2">
            <Swatch color="#c9c9c9" />
            <span className="text-slate-700">ไม่ตรวจ</span>
          </div>

          <div className="flex items-center gap-2">
            <Swatch color="#ff8a2b" />
            <span className="text-slate-700">กำลังตรวจ</span>
          </div>

          <div className="flex items-center gap-2">
            <Swatch color="#39d36a" />
            <span className="text-slate-700">ตรวจแล้ว</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-red-500" />
            <span className="text-slate-700">ผ่านแบบมีเงื่อนไข</span>
          </div>

          {sorted.map((x) => (
            <div key={x.order} className="flex items-center gap-2">
              <Swatch color={x.color} />
              <span className="text-slate-900">
                <span className="font-semibold text-gray-600">ใบงานที่ {x.order}</span>{" "}
                <span className="text-slate-700">({x.checkFormName})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}