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

    const { name, billboardId } = body;
    // authentication
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name || !billboardId)
      return new NextResponse("name and billboardId is required", {
        status: 400,
      });

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    const existingbill = await prismadb.category.findFirst({
      where: {
        name,
        billboardId,
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
    // creating a new category
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params?.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (err) {
    // error handling
    console.log("[CATEGORY_POST]", err);
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params?.storeId,
      },
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.log("[CATEGORY_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
