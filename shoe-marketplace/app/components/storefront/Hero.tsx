import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { db } from "@/db";
import Image from "next/image";


async function getData(){
    const data = await db.banner.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })
    return data
}

export async function Hero(){
    const data = await getData()
    return (
        <Carousel className="pt-2">
            <CarouselContent>
               {data.map((item) => (
                <CarouselItem key={item.id}>
                    <div className="relative aspect-w-16 aspect-h-9 lg:aspect-w-16 lg:aspect-h-9">
                    <Image alt="Banner product image" src={item.imageString} priority fill className="object-cover rounded-lg" />

                    <div className="absolute top-6 left-6 bg-opacity-10 bg-black text-white p-6 rounded-xl shadow-lg transition-transform hover:scale-100">
                    <h1 className="text-xl lg:text-3xl font-bold">{item.title}</h1>
                    </div>
                </div>
                </CarouselItem>
               ))}
            </CarouselContent>
            <CarouselPrevious className="ml-16" />
            <CarouselNext className="mr-16"/>
        </Carousel>
    )
}