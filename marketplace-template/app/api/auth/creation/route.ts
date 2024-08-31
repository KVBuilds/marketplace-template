import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
   noStore();
   try {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user?.id || !user.email) {
         throw new Error("User is not authenticated or missing required information.");
      }

      let dbUser = await db.user.findUnique({
         where: {
            id: user.id,
         },
      });

      if (!dbUser) {
         dbUser = await db.user.create({
            data: {
               id: user.id,
               firstName: user.given_name ?? "",
               lastName: user.family_name ?? "",
               email: user.email ?? "",
               profileImage: user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
            },
         });
      }
      //Needs to check if you are in localhost or development route
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}`);
   } catch (error) {
      console.log("Error in user authentication or database operation.", error);

      return new Response(
         JSON.stringify({ message: "Oops, something went wrong. Please try again." }),
         {
            status: 500,
            headers: { "Content-Type": "application/json" },
         }
      );
   }
}
