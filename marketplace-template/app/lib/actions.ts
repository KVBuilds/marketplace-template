"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod"
import { bannerSchema, productSchema } from "./zodSchema";
import { db } from "@/db";
import { redis } from "./redis";
import { Cart } from "./interfaces";
import { revalidatePath } from "next/cache";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";

//Creates server actions that checks for authentication 
export async function createProduct(prevState: unknown, formData: FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user || user.email !== "kevenjvelasquez@gmail.com"){
        return redirect("/")
    }

    //validate from the db via server side. Use of Conform
    const submission = parseWithZod(formData, {
        schema: productSchema,
    })
    
    if(submission.status !== "success") {
        return submission.reply()
    }

    const flattenUrls = submission.value.images.flatMap((urlString) => urlString.split(",").map((url) => url.trim()))

    await db.product.create({
        data: {
            name: submission.value.name,
            description: submission.value.description,
            status: submission.value.status,
            price: submission.value.price,
            images: flattenUrls,
            category: submission.value.category,
            isFeatured: submission.value.isFeatured === true ? true : false,
    },       
    })
        redirect("/dashboard/products")
}

//Protect routes again - check against zodschema with formdata
export async function editProduct(prevState: any, formData: FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user || user.email !== "kevenjvelasquez@gmail.com"){
        return redirect("/")
    }

    const submission = parseWithZod(formData, {
        schema: productSchema,
    }) 
    if(submission.status !== "success"){
        return submission.reply()
    }
        const flattenUrls = submission.value.images.flatMap((urlString) => urlString.split(",").map((url) => url.trim()))

        const productId = formData.get("productId") as string

    await db.product.update({
        where: {
            id: productId,
        },
        data: {
                name: submission.value.name,
                description: submission.value.description,
                category: submission.value.category,
                price: submission.value.price,
                isFeatured: submission.value.isFeatured === true ? true : false,
                status: submission.value.status,
                images: flattenUrls,
        },
    })
    redirect("/dashboard/products")
}

export async function deleteProduct(formData: FormData){
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user || user.email !== "kevenjvelasquez@gmail.com"){
        return redirect("/")
    }

    await db.product.delete({
        where: {
            id: formData.get("productId") as string,
        },
    })
    redirect("/dashboard/products")
}

export async function createBanner (prevState: any, formData: FormData){
    //Protect server action and validation
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user || user.email !== "kevenjvelasquez@gmail.com"){
        return redirect("/")
}
    const submission = parseWithZod(formData, {
        schema: bannerSchema,
    })
    if(submission.status !== "success"){
        return submission.reply()
    }
    await db.banner.create({
        data: {
            title: submission.value.title,
            imageString: submission.value.imageString,
        },
    })
    redirect("/dashboard/banner")
}

export async function deleteBanner(formData: FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user || user.email !== "kevenjvelasquez@gmail.com"){
        return redirect("/")
}

    await db.banner.delete({
        where: {
            id: formData.get("bannerId") as string
        },
    })
    redirect("/dashboard/banner")
}

//stores data in redis
export async function addItem(productId: string){
    //protects server action -- authentication
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user) {
        return redirect("/")
    }
    let cart: Cart | null = await redis.get(`cart-${user.id}`)

    const selectedProduct = await db.product.findUnique({
        select: {
            id: true,
            name: true,
            price: true,
            images: true,
        },
        where: {
            id: productId,
        },
    })
    if(!selectedProduct){
        throw new Error(`Product with ID ${productId} not found.`)
    }

    let myCart = {} as Cart
    //If the cart was defined, add a new quantity (1); creates new shopping bag
    if(!cart || !cart.items){
        myCart = {
            userId: user.id,
            items: [
                {
                    price: selectedProduct.price,
                    id: selectedProduct.id,
                    imageString: selectedProduct.images[0],
                    name: selectedProduct.name,
                    quantity: 1,
                },
            ],
        }
    }
    else {
        let itemFound = false

        myCart.items = cart.items.map((item) => {
            if(item.id === productId){
                itemFound = true
                item.quantity += 1
            }
            return item
        });

        //Adding a new item to the cart
        if (!itemFound){
            myCart.items.push({
                id: selectedProduct.id,
                imageString: selectedProduct.images[0],
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: 1,
            })
        }
    }

    //Stores the data inside Redis db
    await redis.set(`cart-${user.id}`, myCart);

    //Revalidate the cache
    revalidatePath("/", "layout")
    revalidatePath("/checkout")
}


export async function deleteItem(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/");
    }

    const productId = formData.get("productId");

    if (!productId || typeof productId !== "string") {
        throw new Error("Invalid product ID");
    }

    let cart: Cart | null = await redis.get(`cart-${user.id}`);

    if (cart && cart.items) {
        
        const updatedCart: Cart = {
            userId: user.id,
            items: cart.items.filter((item) => item.id !== productId),
        };

       
        await redis.set(`cart-${user.id}`, updatedCart);
    }
    revalidatePath("/bag");
    return redirect("/bag");
}

//Checkout experience 
export async function checkOut(){
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user) {
        return redirect("/")
    }

    let cart: Cart | null = await redis.get(`cart-${user.id}`)

    if(cart && cart.items){
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => (
            {
                price_data: {
                    currency: "usd",
                    unit_amount: item.price * 100,
                    product_data: {
                        name: item.name,
                        images: [item.imageString],
                    }
                },
                quantity: item.quantity
            }
        ))

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            success_url: "http://localhost:3000/payment/success", //Add latest host URL afterwards
            cancel_url:  "http://localhost:3000/payment/cancel",
            metadata: {
                userId: user.id,
            }
        })
        return redirect(session.url as string)
    }
}
