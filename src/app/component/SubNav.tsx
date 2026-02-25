"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HomeIcon,
  ListBulletIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

type Item = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    label: "จัดการโครงการ",
    href: "/",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    label: "อาคาร / เฟส",
    href: "/project-management/building-phase",
    icon: <ListBulletIcon className="h-5 w-5" />,
  },
  {
    label: "ชั้น / บล็อก",
    href: "/project-management/floor-block",
    icon: <RectangleStackIcon className="h-5 w-5" />,
  },
  {
    label: "ประเภทยูนิต",
    href: "/project-management/unit-type",
    icon: <Squares2X2Icon className="h-5 w-5" />,
  },
  {
    label: "จัดการยูนิต",
    href: "/project-management/unit-manage",
    icon: <AdjustmentsHorizontalIcon className="h-5 w-5" />,
  },
];

export default function ProjectManagementSubNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="sticky top-20 z-[9] w-full bg-white">
      <div className="flex flex-row items-center justify-center w-full p-4 gap-8 overflow-x-auto md:overflow-x-auto scrollbar-hide text-[14px]">
        {ITEMS.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 font-normal transition",
                active
                  ? "bg-[#184777] text-white"
                  : "text-slate-900 hover:bg-[#184777] hover:text-white",
              ].join(" ")}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-center leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="h-px w-full bg-gray-200" />
    </div>
  );
}