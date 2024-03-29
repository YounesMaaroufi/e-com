import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;
    // authentication
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!label || !imageUrl)
      return new NextResponse("label, imageUrl is required", { status: 400 });

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const existingbill = await prismadb.billboard.findFirst({
      where: {
        label,
        imageUrl,
      },
    });

    if (existingbill)
      return new NextResponse("Already exists", { status: 422 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    // creating a new billboard
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params?.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (err) {
    // error handling
    console.log("[BILLBOARD_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params?.storeId,
      },
    });
    return NextResponse.json(billboards);
  } catch (err) {
    console.log("[BILLBOARD_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
