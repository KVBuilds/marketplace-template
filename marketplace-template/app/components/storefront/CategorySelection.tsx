import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export function CategorySelection() {
    return (
        <div className="py-14 sm:py-32">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl text-gray-900 font-bold tracking-tight max-w-prose">Shop by Category</h2>

                <Link className="flex items-center text-sm font-semibold hover:text-primary/80" href="/products/all">Browse all products
                <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </div>

            <div className="py-20 mx-auto grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
            <div className="group aspect-w-2 aspect-h-1 rounded-xl overflow-hidden sm:aspect-w-1 sm:row-span-2">
                <Image src="" alt="All product images." className="object-cover object-center"/>
                <div className="bg-gradient-to-b from-transparent to-black opacity-50"/>
                <div className="p-6 flex items-end">
                    <Link href="/products/all" aria-label="Featured image product.">
                        <h3 className="text-white font-semibold">All Products</h3>
                        <p className="mt-1 text-sm text-white">Shop Now</p>
                    </Link>
                </div>
            </div>

            <div className="group aspect-w-2 aspect-h-1 rounded-xl overflow-hidden sm:relative sm:aspectd-none sm:h-full">
                <Image src="" alt="All product images." className="object-cover object-center sm:absolute sm:-inset-0 sm:w-full sm:h-full"  />
                <div className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"/>
                <div className="p-6 flex items-end sm:absolute sm:inset-0">
                    <Link href="/products/men" aria-label="Secondary featured image product.">
                        <h3 className="text-white font-semibold">Men&apos;s Products</h3>
                        <p className="mt-1 text-sm text-white">Shop Now</p>
                    </Link>
                </div>
            </div>

            <div className="group aspect-w-2 aspect-h-1 rounded-xl overflow-hidden sm:relative sm:aspectd-none sm:h-full">
                <Image src="" alt="All product images." className="object-cover object-center sm:absolute sm:-inset-0 sm:w-full sm:h-full"  />
                <div className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"/>
                <div className="p-6 flex items-end sm:absolute sm:inset-0">
                    <Link href="/products/women" aria-label="Third featured image product.">
                        <h3 className="text-white font-semibold">Women&apos;s Prdoucts</h3>
                        <p className="mt-1 text-sm text-white">Shop Now</p>
                    </Link>
                </div>
            </div>
            
            </div>
        </div>
    )
}