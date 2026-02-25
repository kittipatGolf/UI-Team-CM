import { apiGet } from "../lib/apiClient";

export type CheckFormSummaryItem = {
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

export type UnitStatusDetail = {
  unitId: string;
  unitNo: string;

  buildPhaseId: string;
  buildPhaseName: string;

  floorBlockId: string;
  floorBlockName: string;
  floorBlockNumber: string;
  floorType: string;

  maxActiveCheckFormOrder: number;
  maxActiveCheckFormId: string | null;
  maxActiveCheckFormName: string | null;
  maxActiveCheckFormStatus: string | null;

  statusColor: string;
  overallStatus: string;

  completedCheckLists: number;
  inProgressCheckForms: number;
  completedCheckForms: number;
  totalCheckLists: number;

  hasDefect: boolean;
  typeChecking: "unit" | "area" | string;
};

export type ProjectSummary = {
  projectId: string;
  projectName: string;
  totalUnits: number;
  totalCheckForms: number;
  checkFormSummary: CheckFormSummaryItem[];
  unitStatusDetails: UnitStatusDetail[];
};

const ENDPOINT = "/mock-project.json";

export async function fetchProjectSummary(_projectId?: string) {
  return apiGet<ProjectSummary>(ENDPOINT);
}