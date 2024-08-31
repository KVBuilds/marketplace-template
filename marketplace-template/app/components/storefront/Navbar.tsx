import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ShoppingBagIcon } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
import {LoginLink, RegisterLink} from "@kinde-oss/kinde-auth-nextjs/components"
import { redis } from "@/app/lib/redis";
import { Cart } from "@/app/lib/interfaces";

export async function Navbar(){
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    const cart: Cart | null = await redis.get(`cart-${user?.id}`)

    const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

    return (
       <nav className="bg-white sticky top-0 inset-x-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-50">
        <div className=" flex items-center relative">
        <Link href="/">
        <h1 className="font-bold text-xl lg:text-3xl">Template <span className="text-primary">Marketplace</span></h1>
        </Link>
        <NavbarLinks isAuthenticated={!!user} />
        </div>

        <div className="flex items-center">
        {user ? (
            <>
            <Link href="/bag" className="group p-2 flex items-center mr-2">
            <ShoppingBagIcon  className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800-">{total}</span>
            </Link>

            <UserDropdown email={user.email as string} name={user.given_name as string} 
            userImage={user.picture ?? `https://avatar.vercel.sh/${user.given_name}`}/>
            </>
        ) : (
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-2">
            <Button variant="ghost" asChild>
                <LoginLink>Sign In</LoginLink>
            </Button>
            <span className="h-6 w-px bg-gray-200"></span>
                    <Button variant="ghost" asChild>
                        <RegisterLink>Create Account</RegisterLink>
                    </Button>
            </div>
        )}
        </div>
       </nav>
    )
}