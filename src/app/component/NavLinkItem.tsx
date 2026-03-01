"use client";

import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  active: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function NavLinkItem({
  href,
  active,
  className,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={[
        "flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 transition",
        active
          ? "bg-[#184777] text-white"
          : "text-slate-900 hover:bg-[#184777] hover:text-white",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
