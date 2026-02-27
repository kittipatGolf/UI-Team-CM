"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "../component/Navbar";
import SubNav from "../component/SubNav";
import PageHeader from "./component/PageHeader";
import UnitMatrixTabs from "./component/UnitMatrixTabs";
import InspectionTabs from "./component/InspectionTabs";
import SummaryTable, { type SummaryRow } from "./component/SummaryTable";
import InspectionColor from "./component/InspectionColor";
import UnitMatrixBoard from "./component/UnitMatrixBoard";

import { fetchProjectSummary, type ProjectSummary } from "./projectService";

function avgProgress(items: { progressPercentage: number }[]) {
  if (!items.length) return 0;
  return items.reduce((sum, it) => sum + it.progressPercentage, 0) / items.length;
}

export default function Page() {
  const projectId = "69280c5366b642274141d391";

  const [data, setData] = useState<ProjectSummary | null>(null);

  useEffect(() => {
    fetchProjectSummary(projectId)
      .then(setData)
      .catch(() => { });
  }, [projectId]);

  const legendForms = useMemo(() => {
    if (!data?.checkFormSummary?.length) return [];
    const sorted = [...data.checkFormSummary].sort((a, b) => a.order - b.order);
    return sorted.map((x, idx) => ({
      order: idx + 1,
      checkFormName: x.checkFormName,
      color: x.color,
    }));
  }, [data]);

  const summaryRow: SummaryRow | null = useMemo(() => {
    if (!data) return null;

    const structureItems = data.checkFormSummary.filter(
      (x) => x.order >= 1 && x.order <= 5
    );
    const roomItems = data.checkFormSummary.filter(
      (x) => x.order >= 6 && x.order <= 17
    );

    const remaining = roomItems.length > 0 ? roomItems[0].notStartedUnits : 0;

    return {
      projectName: data.projectName,
      totalUnits: data.totalUnits,
      structurePct: avgProgress(structureItems),
      roomPct: avgProgress(roomItems),
      remaining,
    };
  }, [data]);

  const boardUnits = useMemo(() => {
    return data?.unitStatusDetails ?? [];
  }, [data]);

  return (
    <>
      <Navbar subNav={<SubNav/>} />

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

            {summaryRow && <SummaryTable row={summaryRow} />}

            <InspectionColor projectId={projectId} checkForms={legendForms} />

            {boardUnits.length > 0 && (
              <UnitMatrixBoard
                units={boardUnits}
                checkFormColors={legendForms}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
