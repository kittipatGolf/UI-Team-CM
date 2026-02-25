"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "../component/Navbar";
import SubNav from "../component/SubNav";
import PageHeader from "./component/PageHeader";
import UnitMatrixTabs from "./component/UnitMatrixTabs";
import InspectionTabs from "./component/InspectionTabs";
import SummaryTable, { type SummaryRow } from "./component/SummaryTable";

import { fetchProjectSummary, type ProjectSummary } from "./projectService";

function avgProgress(items: { progressPercentage: number }[]) {
  if (!items.length) return 0;
  return items.reduce((sum, it) => sum + it.progressPercentage, 0) / items.length;
}

export default function Page() {
  const [data, setData] = useState<ProjectSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectSummary("69280c5366b642274141d391")
      .then(setData)
      .catch((e) => setError(e?.message ?? "Failed to load"));
  }, []);

  // ✅ map จาก mock -> SummaryRow
  const summaryRow: SummaryRow | null = useMemo(() => {
    if (!data) return null;

    const structureItems = data.checkFormSummary.filter(
      (x) => x.order >= 1 && x.order <= 5
    );
    const roomItems = data.checkFormSummary.filter(
      (x) => x.order >= 6 && x.order <= 17
    );

    // mock remaining: ถ้ามี roomItems ใช้ notStartedUnits ของตัวแรก
    const remaining = roomItems.length > 0 ? roomItems[0].notStartedUnits : 0;

    return {
      projectName: data.projectName,
      totalUnits: data.totalUnits,
      structurePct: avgProgress(structureItems),
      roomPct: avgProgress(roomItems),
      remaining,
    };
  }, [data]);

  return (
    <>
      <Navbar />
      <SubNav />

      <div className="flex-1 bg-[#f3f4f6] pt-8">
        <PageHeader
          title={`Unitmatrix : ${data?.projectName ?? "Loading..."}`}
          backHref="/project-management"
          backLabel="กลับหน้ารวมโครงการ"
        />

        <div className="flex w-full flex-col items-center gap-4 rounded-lg bg-[#f3f4f6] p-4 px-10 pb-40 md:px-20 xl:px-40">
          <UnitMatrixTabs />

          <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-white p-8">
            <InspectionTabs />
            {error ? (
              <div className="w-full rounded-md bg-red-50 p-4 text-[14px] text-red-700">
                {error}
              </div>
            ) : !summaryRow ? (
              <div className="w-full rounded-md bg-slate-50 p-4 text-[14px] text-slate-700">
                Loading...
              </div>
            ) : (
              <SummaryTable row={summaryRow} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}