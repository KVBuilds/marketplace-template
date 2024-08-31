import { CheckoutButton, DeleteItem } from "@/app/components/SubmitButtons";
import { checkOut, deleteItem } from "@/app/lib/actions";
import { Cart } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

export default async function BagRoute() {
    noStore()
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/");
    }

    const cart: Cart | null = await redis.get(`cart-${user.id}`);
    let totalPrice = 0;

    cart?.items.forEach((item) => {
        totalPrice += item.price * item.quantity;
    });

    return (
        <div className="max-w-2xl mx-auto mt-10 min-h-[55vh]">
            {(!cart || cart.items.length === 0) ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <ShoppingBagIcon className="w-10 h-10 text-primary"/>
                </div>
                <h2 className="mt-6 text-xl font-semibold">You don&apos;t have any products in your bag.</h2>
                    <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-sm mx-auto">You shoppping bag is currently empty. Continue shopping to see your items here.</p>
                    <Button asChild>
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div>
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex mb-6">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                                <Image fill className="rounded-md object-cover" src={item.imageString} alt="Product image" />
                            </div>
                            <div className="ml-5 flex justify-between w-full font-medium">
                                <p>{item.name}</p>
                                <div className="flex flex-col h-full justify-between text-end">
                                    <div className="flex items-center gap-x-2">
                                        <p>{item.quantity} x</p>
                                        <p>${item.price}</p>
                                    </div>
                                    <form action={deleteItem}>
                                        <input type="hidden" name="productId" value={item.id} />
                                        <DeleteItem />
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-10">
                        <div className="flex items-center justify-between font-medium">
                            <p>Subtotal</p>
                            <p>${new Intl.NumberFormat("en-US").format(totalPrice)}</p>
                        </div>
                        <form action={checkOut}>
                          <CheckoutButton />  
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
