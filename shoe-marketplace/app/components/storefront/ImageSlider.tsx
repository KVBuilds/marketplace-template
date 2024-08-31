"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface iAppProps {
    images: string[]
}

export default function ImageSlier({images}: iAppProps){
    const [mainImageIndex, setMainImageIndex] = useState(0)

    function handlePreviousClick(){
        setMainImageIndex((prevIndex) => (
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        ))
    }

    function handleNextClick(){
        setMainImageIndex((prevIndex) => (
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ))
    }

    function handleImageClick(index: number){
        setMainImageIndex(index)
    }



    return (
        <div className="grid gap-6 md:gap-3 items-start">
            <div className="relative overflow-hidden rounded-lg">
                <Image className="object-cover w-[600px] h-[600px]" src={images[mainImageIndex]} alt="Product image." 
                width={600} height={600}/>

                <div className="absolute inset-0 flex items-center justify-between px-4">
                    <Button variant="ghost" size="icon">
                        <ChevronLeftIcon onClick={handlePreviousClick} className="w-6 h-6"/>
                    </Button>
                    <Button onClick={handleNextClick} variant="ghost" size="icon">
                        <ChevronRightIcon className="w-6 h-6"/>
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
                {images.map((image, index) => (
                    //Renders new div element
                    <div className={cn(index === mainImageIndex ? "border-2 border-primary" : "border border-gray-200", 
                        "relative overflow-hidden rounded-lg cursor-pointer"
                    )} onClick={() => handleImageClick(index)} key={index}>
                        <Image src={image} alt="Product image" width={100} height={100} className="object-cover w-[100px] h-[100px]"/>
                        </div>
                ))}
            </div>
        </div>
    )
}