"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
  subNav?: React.ReactElement<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  hideAfter?: number;
};

export default function AppNavbar({
  userName = "Admin User",
  onLogout,
  subNav,
  hideAfter = 24,
}: Props) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const headerRef = useRef<HTMLElement | null>(null);

  const [hideTop, setHideTop] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastYRef = useRef(0);
  const hideTopRef = useRef(false);
  const lockUntilRef = useRef(0);

  useEffect(() => {
    hideTopRef.current = hideTop;
  }, [hideTop]);

  useEffect(() => {
    document.body.style.overflowAnchor = "none";
    return () => {
      document.body.style.overflowAnchor = "";
    };
  }, []);

  useEffect(() => {
    if (!subNav) return;

    const MIN_HIDE_DELTA = 8;
    const ANIM_MS = 300;
    const LOCK_MS = ANIM_MS + 120;

    const setHidden = (nextHidden: boolean, y: number, now: number) => {
      if (hideTopRef.current === nextHidden) return;
      hideTopRef.current = nextHidden;
      setHideTop(nextHidden);

      lockUntilRef.current = now + LOCK_MS;
      lastYRef.current = y;
    };

    const tick = () => {
      const y = window.scrollY || 0;
      const now = performance.now();

      if (now < lockUntilRef.current) {
        lastYRef.current = y;
        return;
      }

      const dy = y - lastYRef.current;

      if (y <= 4) {
        setHidden(false, y, now);
        lastYRef.current = y;
        return;
      }

      if (dy < 0) {
        lastYRef.current = y;
        return;
      }

      if (dy < MIN_HIDE_DELTA) {
        lastYRef.current = y;
        return;
      }

      if (y > hideAfter) {
        setHidden(true, y, now);
      }

      lastYRef.current = y;
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        tick();
      });
    };

    lastYRef.current = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [subNav, hideAfter]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const root = document.documentElement;
    const setVar = () => {
      root.style.setProperty("--app-navbar-h", `${el.offsetHeight}px`);
    };

    setVar();
    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);
    window.addEventListener("resize", setVar);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  const subNavWrapperClass = useMemo(() => {
    if (!subNav) return "";
    return [
      "sticky z-30 bg-white",
      "bg-white",
      "[overflow-anchor:none]",
    ].join(" ");
  }, [subNav]);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-20 w-full [overflow-anchor:none] bg-white border-b border-gray-200"
      >
        <div className="flex h-20 w-full flex-row items-center justify-between flex-nowrap bg-white p-4 text-[16px]">
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/project-management"
              className="flex items-center gap-2"
            >
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
      </header>

      {subNav
        ? React.isValidElement(subNav)
          ? React.cloneElement(subNav, {
              className: [subNavWrapperClass, subNav.props?.className ?? ""].join(
                " "
              ),
              style: {
                ...(subNav.props?.style ?? {}),
                top: hideTop ? 0 : "var(--app-navbar-h, 80px)",
                transition: "top 300ms cubic-bezier(0.2,0.8,0.2,1)",
                willChange: "top",
                minHeight: "56px",
              },
            })
          : subNav
        : null}
    </>
  );
}
