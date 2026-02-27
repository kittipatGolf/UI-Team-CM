"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type Props = {
  title: string;
  backHref?: string;
  backLabel?: string;
};

export default function PageHeader({
  title,
  backHref = "/project-management",
  backLabel = "กลับหน้ารวมโครงการ",
}: Props) {
  return (
    <div className="w-full bg-[#f3f4f6]">
      <div className="flex w-full items-center gap-4 px-10 pt-8 md:px-20 xl:px-40">
        <Link
          href={backHref}
          className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-[16px] text-[#184777] hover:bg-slate-50"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          <span className="whitespace-nowrap">{backLabel}</span>
        </Link>

        <div className="flex flex-1 justify-center">
          <h1 className="text-[24px] font-bold text-slate-900">
            {title}
          </h1>
        </div>

        <div className="w-[220px]" />
      </div>
    </div>
  );
}