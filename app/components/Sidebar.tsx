"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Table, PieChart } from "lucide-react";

const links = [
  { href: "/", label: "Table", icon: Table },
  { href: "/charts", label: "Charts", icon: PieChart },
  { href: "/skills", label: "Skills", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 h-full fixed bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white p-2 flex flex-col gap-4 items-center">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          href={href}
          key={href}
          className={`p-2 rounded ${
            pathname === href ? "bg-gray-300 dark:bg-gray-700" : ""
          }`}
          title={label}
        >
          <Icon className="w-6 h-6" />
        </Link>
      ))}
    </aside>
  );
}

