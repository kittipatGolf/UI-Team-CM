import { NextResponse } from "next/server";

type CheckFormSummaryItem = {
  checkFormId: string;
  checkFormName: string;
  order: number;
  color: string;
  typeChecking: "unit" | "area" | string;
  totalUnits: number;
  notStartedUnits: number;
  inProgressUnits: number;
  completedUnits: number;
  notApplicableUnits: number;
  progressPercentage: number;
};

type ProjectSummary = {
  projectId: string;
  projectName: string;
  totalUnits: number;
  totalCheckForms: number;
  checkFormSummary: CheckFormSummaryItem[];
};

const MOCK_PROJECT: ProjectSummary = {
  projectId: "69280c5366b642274141d391",
  projectName: "Test Project 01",
  totalUnits: 89,
  totalCheckForms: 12,
  checkFormSummary: [
    {
      checkFormId: "68ff64e6eda193c889b31750",
      checkFormName: "งานตรวจสอบ Line และระดับอ้างอิง",
      order: 7,
      color: "#BB8FCE",
      typeChecking: "unit",
      totalUnits: 89,
      notStartedUnits: 81,
      inProgressUnits: 0,
      completedUnits: 8,
      notApplicableUnits: 0,
      progressPercentage: 8.98876404494382,
    },
  ],
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  if (projectId && projectId !== MOCK_PROJECT.projectId) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(MOCK_PROJECT);
}