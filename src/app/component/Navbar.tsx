"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "โครงการ", href: "/project-management" },
  { label: "การตรวจสอบ", href: "/audits" },
  { label: "พนักงาน", href: "/employees" },
  { label: "ผู้ที่เกี่ยวข้อง", href: "/stakeholders" },
  { label: "ตั้งค่า", href: "/settings" },
  { label: "ผู้ใช้งาน", href: "/users" },
];

type Props = {
  userName?: string;
  onLogout?: () => void;

  /** ส่ง SubNav เข้ามาไว้ “ใน header เดียวกัน” */
  subNav?: React.ReactNode;

  /** เลื่อนเกินกี่ px ถึงจะยุบแถว Navbar */
  collapseAt?: number;
};

export default function AppNavbar({
  userName = "Admin User",
  onLogout,
  subNav,
  collapseAt = 60,
}: Props) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!subNav) return; // ไม่มี subNav ก็ไม่ต้องยุบ

    const onScroll = () => setCollapsed(window.scrollY > collapseAt);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [subNav, collapseAt]);

  return (
    <header className="sticky top-0 z-20 w-full bg-white">
      {/* แถว Navbar (ยุบได้) */}
      <div
        className={[
          "overflow-hidden transition-[max-height] duration-200",
          collapsed ? "max-h-0" : "max-h-[84px]", // 80px + divider
        ].join(" ")}
      >
        <div className="flex h-20 w-full flex-row items-center justify-between flex-nowrap p-4 text-[16px]">
          {/* Left */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/project-management" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="UI Team CM"
                width={34}
                height={34}
                priority
              />
              <span className="font-semibold tracking-tight text-slate-800">
                TEAM•CM
              </span>
            </Link>
          </div>

          {/* Center */}
          <div className="flex flex-row items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-[16px] font-medium transition",
                    active
                      ? "bg-[#184777] text-white"
                      : "text-slate-900 hover:bg-[#184777] hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex flex-row items-center gap-3 shrink-0 whitespace-nowrap">
            <button
              type="button"
              className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-transparent px-4 py-2 font-medium text-slate-800 hover:text-slate-900"
            >
              {userName}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-gray-300 px-4 py-2 text-[16px] font-medium text-gray-500 hover:bg-gray-400 hover:text-gray-800"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>

        <div className="h-0.5 w-full bg-gray-200" />
      </div>

      {/* แถว SubNav (อยู่ใน header เดียวกัน) */}
      {subNav ? (
        <>
          <div className="flex min-h-[56px] w-full items-center justify-center px-4">
            {subNav}
          </div>
          <div className="h-0.5 w-full bg-gray-200" />
        </>
      ) : (
        <div className="h-0.5 w-full bg-gray-200" />
      )}
    </header>
  );
}