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

export type ProjectSummary = {
  projectId: string;
  projectName: string;
  totalUnits: number;
  totalCheckForms: number;
  checkFormSummary: CheckFormSummaryItem[];
};

export async function fetchProjectSummary(projectId?: string) {
  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  return apiGet<ProjectSummary>(`/api/mock/project${qs}`);
}