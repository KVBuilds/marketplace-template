"use client"

import { categories } from "@/app/lib/categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeftIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { SubmitButton } from "../SubmitButtons"
import { UploadDropzone } from "@/app/lib/uploadthing"
import { useState } from "react"
import { useFormState } from "react-dom"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import Image from "next/image"
import { productSchema } from "@/app/lib/zodSchema"
import { createProduct, editProduct } from "@/app/lib/actions"
import { type $Enums } from "@prisma/client"


interface iAppProps {
     data: {
        id: string;
        name: string;
        description: string;
        status: $Enums.ProductStatus;
        price: number;
        images: string[];
        category: $Enums.Category;
        isFeatured: boolean;
    }
}

export function EditForm({data}: iAppProps) {
    const [images, setImages] = useState<string[]>(data.images)
    const [lastResult, action] = useFormState(editProduct, undefined)
    //Revalidating form data on the client side via Conform
    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {schema:productSchema})
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    const handleDelete = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    return (
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <input type="hidden" name="productId" value={data.id} />
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/products"><ChevronLeftIcon className="w-4 h-4" /></Link>
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-90 sm:text-4xl">Edit Product</h1>
        </div>

        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Update your digital products</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <Label>Name</Label>
                        <Input type="text"
                        key={fields.name.key} name={fields.name.name} defaultValue={data.name}
                        className="w-full" placeholder="Product Name" />
                        <p className="text-red-500">{fields.name.errors}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Description</Label>
                        <Textarea key={fields.description.key} name={fields.description.name} defaultValue={fields.description.initialValue} placeholder="Add your description"/>
                        <p className="text-red-500">{fields.description.errors}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Price</Label>
                        <Input key={fields.price.key} name={fields.price.name} defaultValue={data.price} type="number" placeholder="$$" />
                        <p className="text-red-500">{fields.price.errors}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Featured Product</Label>
                        <Switch key={fields.isFeatured.key} name={fields.isFeatured.name} defaultChecked={data.isFeatured}/>
                        <p className="text-red-500">{fields.isFeatured.errors}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Status</Label>
                        <Select key={fields.status.key} name={fields.status.name} defaultValue={data.status}><SelectTrigger>
                            <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent></Select>
                            <p className="text-red-500">{fields.status.errors}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Category</Label>
                        <Select key={fields.category.key} name={fields.category.name} defaultValue={data.category}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.name}>
                                        {category.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-red-500">{fields.category.errors}</p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <Label>Images</Label>
                        {/*Logic to render and preview images after uploading */}
                        <Input type="hidden" value={images} key={fields.images.key} name={fields.images.name} defaultValue={fields.images.initialValue as any} />
                        {images.length > 0 ? (
                                <div className="flex gap-5">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative w-[100px] h-[100px]">
                                            <Image height={100} width={100} src={image} alt="Prdocut image"
                                            className="w-full h-full object-cover rounded-lg border"/>
                                            <button onClick={() => handleDelete(index)} className="absolute -top-3 -right-3 bg-zinc-100 p-2 rounded-md text-zinc-600">
                                                <XIcon className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                        ) : (
                            <UploadDropzone endpoint="imageUploader" onClientUploadComplete={(res) => {
                            setImages(res.map((r) => r.url))
                        }} onUploadError={() => alert("Something went wrong.")}
                         />
                        )}   
                        <p className="text-red-500">{fields.images.errors}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <SubmitButton text="Update Product"/>
            </CardFooter>
        </Card>
    </form>
    )
}