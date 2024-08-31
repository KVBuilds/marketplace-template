import { db } from "@/db";
import { LoadingProductCard, ProductCard } from "./ProductCard";
import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";

async function getData() {
    const data = await db.product.findMany({
        where: {
            status: "published",
            isFeatured: true,
        },
        select: {
            id: true,
            name: true,
            description: true,
            images: true,
            price: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 3,
    });
    return data;
}

export function FeaturedProducts() {
    return (
        <>
            <h2 className="text-2xl font-semibold tracking-tight">Featured Items</h2>
            <Suspense fallback={<LoadingRows />}>
                <LoadFeaturedProducts />
            </Suspense>
        </>
    );
}

async function LoadFeaturedProducts() {
    noStore()
    const data = await getData();

    return (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((item) => (
                <ProductCard key={item.id} item={item} />
            ))}
        </div>
    );
}

function LoadingRows() {
    return (
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <LoadingProductCard />
            <LoadingProductCard />
            <LoadingProductCard />
        </div>
    );
}