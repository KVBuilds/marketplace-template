import { ProductCard } from "@/app/components/storefront/ProductCard"
import { db } from "@/db"
import { notFound } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"

async function getData(productCategory: string){
    //pass category name
    switch(productCategory){
        case "all": {
            const data = await db.product.findMany({
                select: {
                    name: true,
                    images: true, 
                    price: true,
                    id: true,
                    description: true,
                }, 
                where: {
                    status: "published",
                },
            })
            return {
                title: "All Products",
                data: data,
            }
        }
        case "men": {
            const data = await db.product.findMany({
                where: {
                    status: "published",
                    category: "men",
                },
                select: {
                    name: true,
                    images: true, 
                    price: true,
                    id: true,
                    description: true,
                },
            })
            return {
                title: "Products for Men",
                data: data,
            }
        }
        case "women": {
            const data = await db.product.findMany({
                where: {
                    status: "published",
                    category: "women",
                },
                select: {
                    name: true,
                    images: true, 
                    price: true,
                    id: true,
                    description: true,
                }
            })
            return {
                title: "Products for Women",
                data: data,
            }
        }
        default: {
            return notFound()
        }
    } 
}

export default async function CategoriesPage({params}: {params: {name: string}}){
    noStore()
    const {data, title} = await getData(params.name)

    return (
       <section>
        <h1 className="relative font-semibold text-3xl my-5 pt-10 tracking-tight text-balance !leading-tight">{title}</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => (
            <ProductCard key={item.id} item={item} />
        ))}
        </div>
        </section>
    )
}