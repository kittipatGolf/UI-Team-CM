"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

function IconHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconLayers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3 3 8l9 5 9-5-9-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M3 12l9 5 9-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M3 16l9 5 9-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconGrid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconSliders(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h6M14 18h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 6a2 2 0 1 0 0 .01V6Zm-4 12a2 2 0 1 0 0 .01V18Zm-4-6a2 2 0 1 0 0 .01V12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

const ITEMS: Item[] = [
  // ✅ แนะนำให้ชี้มาที่หน้าโครงการจริงของคุณ (ถ้าหน้าแรกคือ /project-management)
  { label: "จัดการโครงการ", href: "/project-management", icon: <IconHome className="h-5 w-5" /> },
  { label: "อาคาร / เฟส", href: "/project-management/building-phase", icon: <IconList className="h-5 w-5" /> },
  { label: "ชั้น / บล็อก", href: "/project-management/floor-block", icon: <IconLayers className="h-5 w-5" /> },
  { label: "ประเภทยูนิต", href: "/project-management/unit-type", icon: <IconGrid className="h-5 w-5" /> },
  { label: "จัดการยูนิต", href: "/project-management/unit-manage", icon: <IconSliders className="h-5 w-5" /> },
];

export default function ProjectManagementSubNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    // ✅ sticky ใต้ Navbar (Navbar สูง h-20 => top-20)
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