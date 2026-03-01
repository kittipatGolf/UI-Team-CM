"use client";

import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ListBulletIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import NavLinkItem from "./NavLinkItem";

type Item = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    label: "จัดการโครงการ",
    href: "/",
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    label: "อาคาร / เฟส",
    href: "/project-management/building-phase",
    icon: <ListBulletIcon className="h-6 w-6" />,
  },
  {
    label: "ชั้น / บล็อก",
    href: "/project-management/floor-block",
    icon: <RectangleStackIcon className="h-6 w-6" />,
  },
  {
    label: "ประเภทยูนิต",
    href: "/project-management/unit-type",
    icon: <Squares2X2Icon className="h-6 w-6" />,
  },
  {
    label: "จัดการยูนิต",
    href: "/project-management/unit-manage",
    icon: <AdjustmentsHorizontalIcon className="h-6 w-6" />,
  },
];

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function ProjectManagementSubNav({ className, style }: Props) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div
      className={[
        "flex flex-row h-20 items-center justify-center w-full gap-8 overflow-x-auto scrollbar-hide text-[14px] px-4 py-4",
        className ?? "",
      ].join(" ")}
      style={style}
    >
      {ITEMS.map((item) => {
        const active = isActive(item.href);

        return (
          <NavLinkItem
            key={item.href}
            href={item.href}
            active={active}
            className="gap-2 font-normal"
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="text-center leading-none">{item.label}</span>
          </NavLinkItem>
        );
      })}
    </div>
  );
}
