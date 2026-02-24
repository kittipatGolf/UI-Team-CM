"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
};

export default function AppNavbar({ userName = "Admin User", onLogout }: Props) {
    const pathname = usePathname();
    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="sticky top-0 z-10 w-full bg-white">
            <div className="flex flex-row items-center w-full h-20 p-4 justify-between flex-nowrap text-[16px]">
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

            <div className="w-full h-0.5 bg-gray-200" />
        </header>
    );
}