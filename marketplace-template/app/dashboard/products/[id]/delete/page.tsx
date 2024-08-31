import { SubmitButton } from "@/app/components/SubmitButtons";
import { deleteProduct } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DeleteRoute({params}: {params: {id: string}}) {
    return (
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>Delete item?</CardTitle>
                    <CardDescription>This will delete the product and remove all data.</CardDescription>
                </CardHeader>
                <CardFooter className="w-full flex justify-between">
                    <Button variant="secondary" asChild><Link href="/dashboard/products">Cancel</Link></Button>
                    <form action={deleteProduct}>
                        <input type="hidden" name="productId" value={params.id}/>
                        <SubmitButton variant="destructive" text="Delete Product" />
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}