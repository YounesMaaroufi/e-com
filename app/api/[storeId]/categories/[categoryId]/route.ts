import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  // this dash '_' tells that the req is not gonna be used
  _req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId)
      return new NextResponse("category Id is required", { status: 400 });

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.log("[CATEGORY_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unothorized", { status: 401 });

    const { name, billboardId } = body;

    if (!name || !billboardId)
      return new NextResponse("name and Image are required", { status: 400 });
    console.log(params.categoryId);

    if (!params.categoryId) {
      return new NextResponse("category Id is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("store Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.log("[CATEGORY_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  // this dash '_' tells that the req is not gonna be used
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unothorized", { status: 401 });

    if (!params.storeId)
      return new NextResponse("storeId is required", { status: 400 });
    if (!params.categoryId)
      return new NextResponse("category Id is required", { status: 400 });
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
        // remove this if you got an error
        storeId: params.storeId,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.log("[CATEGORY_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
