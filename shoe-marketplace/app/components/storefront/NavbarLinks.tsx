"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const navbarLinks = [
    {
        id: 0,
        name: "Home",
        href: "/",
    },
    {
        id: 1,
        name: "All products",
        href: "/products/all",
    },
    {
        id: 2,
        name: "Men",
        href: "/products/men",
    },
    {
        id: 3,
        name: "Women",
        href: "/products/women"
    },
]

interface NavbarLinksProps {
    isAuthenticated: boolean;
}

export function NavbarLinks({ isAuthenticated }: NavbarLinksProps) {
    const location = usePathname()

    const allLinks = [
        ...navbarLinks,
        ...(isAuthenticated ? [{ id: 4, name: "Dashboard", href: "/dashboard" }] : [])
    ]

    return (
        <div className="hidden md:flex justify-center items-center gap-x-1 ml-8">
            {allLinks.map((item) => (
                <Link href={item.href} key={item.id} className={cn(
                    location === item.href ? "bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-opacity-75",
                    "group p-2 font-medium rounded-md"
                )}>
                    {item.name}
                </Link>
            ))}
        </div>
    )
}