import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { DollarSignIcon, PartyPopperIcon, ShoppingBagIcon, User2Icon } from "lucide-react";


async function getData(){

    const [user, products, order] = await Promise.all([
        db.user.findMany({
            select: {
                id: true,
            },
        }),
        db.product.findMany({
            select: {
                id: true,
            },
        }),
        db.order.findMany({
            select: {
                amount: true,
            }
        }),
    ])
    return {
        user,
        products,
        order,
    }
}


export async function DashboardStats(){
    const {products, user, order} = await getData()

    const totalAmount = order.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount
    }, 0)
    
    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Total Revenue</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">${new Intl.NumberFormat("en-US").format(totalAmount / 100)}</p>
                <p className="text-xs text-muted-foreground">Based on 100 charges</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Total Sales</CardTitle>
                <ShoppingBagIcon className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{order.length}</p>
                <p className="text-xs text-muted-foreground">Total sales on marketplace</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Total Products</CardTitle>
                <PartyPopperIcon className="h-4 w-4 text-indigo-300" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground">Total products created</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Total Users</CardTitle>
                <User2Icon className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{user.length}</p>
                <p className="text-xs text-muted-foreground">Total users signed up</p>
            </CardContent> 
        </Card>
       </div>
       )
}