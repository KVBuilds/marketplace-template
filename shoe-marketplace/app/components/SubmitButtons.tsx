"use client"

import { Button } from "@/components/ui/button"
import { Loader2, ShoppingBag } from "lucide-react"
import { useFormStatus } from "react-dom"

type ButtonVariant = "secondary" | "ghost" | "link" | "destructive" | null | undefined

interface buttonProps {
    text: string
    variant?: ButtonVariant
}

export function SubmitButton({text, variant}: buttonProps) {
    const {pending} = useFormStatus()
    return (
        <>
        {pending ? (
            <Button disabled variant={variant}>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Product
            </Button>
        ) : (
            <Button variant={variant} type="submit">{text}</Button>
        ) }
        </>
    )
}

export function BannerSubmitButton({ text, variant }: buttonProps) {
    const { pending } = useFormStatus()
    return (
        <>
        {pending ? (
            <Button disabled variant={variant}>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Banner
            </Button>
        ) : (
            <Button variant={variant} type="submit">{text}</Button>
        )}
        </>
    )
}

export function ShoppingBagButton(){
    const {pending} = useFormStatus()

    return (
        <>
        {pending ? (
            <Button disabled size="lg" className="w-full mt-5">
                <Loader2 className="mr-4 h-5 w-5 animate-spin" />Please wait
            </Button>
        ) : (
            <Button size="lg" className="w-full mt-5" type="submit">
                <ShoppingBag className="mr-4 h-5 w-5"/>Add to Cart
            </Button>
        )}
        </>
    )
}

export function DeleteItem(){
    const {pending} = useFormStatus()

    return (
        <>
        {pending ? (
            <button disabled className="font-medium text-primary text-end">Removing . . . </button>
        ) : (
            <button type="submit" className="font-medium text-primary text-end">Remove</button>
        )}
        </>
    )
}

export function CheckoutButton(){
    const {pending} = useFormStatus()
    
    return (
        <>
        {pending ? (
            <Button disabled size="lg" className="w-full mt-5">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
            </Button>
        ) : (
            <Button type="submit" size="lg" className="w-full mt-5">Checkout</Button>
        )}
        </>
    )
}