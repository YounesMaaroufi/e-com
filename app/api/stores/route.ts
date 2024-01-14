import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });

    const existingStore = await prismadb.store.findFirst({
      where: {
        name,
      },
    });

    if (existingStore)
      return new NextResponse("Already exists", { status: 422 });

    const store = await prismadb.store.create({
      data: { name, userId },
    });
    return NextResponse.json(store);
  } catch (err) {
    console.log("[STORES_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
