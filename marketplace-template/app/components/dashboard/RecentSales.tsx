import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";

async function getData(){
    const data = await db.order.findMany({
        select: {
            amount: true, 
            id: true,
            User: {
                select: {
                    firstName: true, 
                    profileImage: true, 
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 7,
    });
    return data;
}

export async function RecentSales() {
    const data = await getData();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="py-6 flex flex-col gap-8">
                {data.map((item) => (
                    <div className="flex items-center gap-4" key={item.id}>
                        <Avatar className="hidden sm:flex h-9 w-9">
                            <AvatarImage src={item.User?.profileImage} alt="Avatar image." />
                            <AvatarFallback>{item.User?.firstName.slice(0, 3)}</AvatarFallback>
                        </Avatar>

                        <div className="grid gap-1">
                            <p className="text-sm font-medium">{item.User?.firstName}</p>
                            <p className="text-sm text-muted-foreground">{item.User?.email}</p>
                        </div>
                        <p className="ml-auto font-medium">+${new Intl.NumberFormat("en-US").format(item.amount / 100)}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
