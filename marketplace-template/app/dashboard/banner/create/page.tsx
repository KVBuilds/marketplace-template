"use client"

import { BannerSubmitButton, SubmitButton } from "@/app/components/SubmitButtons";
import { createBanner, createProduct } from "@/app/lib/actions";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { bannerSchema } from "@/app/lib/zodSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function BannerRoute() {
    const [image, setImages] = useState<string | undefined>(undefined)
    const [lastResult, action] = useFormState(createBanner, undefined)

    const [form, fields] = useForm({
        lastResult,

        onValidate({formData}){
            return parseWithZod(formData, {schema: bannerSchema})
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
        <div className="flex items-center gap-x-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/products">
            <ChevronLeft className="w-4 h-4"/>
            </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-90 sm:text-4xl">New Banner</h1>
        </div>

        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Banner details</CardTitle>
                <CardDescription>Create and add details to your banner</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-y-6">
                    <div className="flex flex-col gap-3">
                        <Label>Name</Label>
                        <Input name={fields.title.name} key={fields.title.key}
                        defaultValue={fields.title.initialValue} type="text" placeholder="Add title to the banner" />
                        <p className="text-red-500">{fields.title.errors}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Add Image</Label>
                        <input type="hidden" value={image} key={fields.imageString.key} name={fields.imageString.name}
                         defaultValue={fields.imageString.initialValue} />
                        {image !== undefined ? (
                            <Image src={image} alt="Banner image" width={200} height={200} 
                            className="w-[200px] h-[200px] object-cover border rounded-lg" />
                        ) : (
                            <UploadDropzone onClientUploadComplete={(res) => {
                                setImages(res[0].url)
                            }} onUploadError={() => {
                                alert("Something went wrong. Please try again.")
                            }} endpoint="bannerImageRoute" />
                        )}
                        <p className="text-red-500">{fields.imageString.errors}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter><BannerSubmitButton text="Create Banner" /></CardFooter>
        </Card>
    </form>
    )
}