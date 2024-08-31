import { redis } from "@/app/lib/redis";
import { stripe } from "@/app/lib/stripe";
import { db } from "@/db";
import { headers } from "next/headers"

export async function POST(req: Request) {
    const body = await req.text()

    //making sure signature from stripe is safe
    const signature = headers().get("Stripe-Signature") as string

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_SECRET_WEBHOOK as string
        )
    } catch (error: unknown) {
        return new Response("Webhook Error", {status: 400})
    }

    switch(event.type){
        case "checkout.session.completed": {
            const session = event.data.object
            
            await db.order.create({
                data: {
                    amount: session.amount_subtotal as number,
                    status: session.status as string,
                    userId: session.metadata?.userId,
                },
            })
            await redis.del(`cart-${session.metadata?.userId}`)
            break;
        } default: {
            console.log("Unhandled event")
        }
    }
    return new Response(null, {status: 200})
}