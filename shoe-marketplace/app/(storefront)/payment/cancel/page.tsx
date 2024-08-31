import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CancelRoute(){
    return (
        <section className="w-full min-h-[80vh] flex items-center justify-center">
            <Card className="w-[350px]">
                <div className="p-6">
                     <div className="w-full flex justify-center">
                        <XCircle className="w-12 h-12 rounded-full bg-red-500/30 text-red-500 p-2"/>
                     </div>
                     <div className="mt-3 text-center sm:mt-5 w-full">
                        <h3 className="text-lg leading-6 font-medium">Payment Cancelled</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Your payment was not charged. Return to your shopping bag or continue shopping. </p>

                        <Button asChild variant="outline" className="w-full mt-4">
                            <Link href="/bag">Return to Bag</Link>
                        </Button>
                        <Button asChild className="w-full mt-3 sm:mt-4">
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                     </div>
                </div>
            </Card>
        </section>
    )
}