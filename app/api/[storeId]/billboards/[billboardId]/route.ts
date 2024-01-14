import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  // this dash '_' tells that the req is not gonna be used
  _req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId)
      return new NextResponse("billboardId is required", { status: 400 });

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[BILLBOARD_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unothorized", { status: 401 });

    const { label, imageUrl } = body;

    if (!label || !imageUrl)
      return new NextResponse("Label and Image are required", { status: 400 });
    console.log(params.billboardId);

    if (!params.billboardId) {
      return new NextResponse("billboardId is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
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
    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[STORE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  // this dash '_' tells that the req is not gonna be used
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unothorized", { status: 401 });

    if (!params.storeId)
      return new NextResponse("storeId is required", { status: 400 });
    if (!params.billboardId)
      return new NextResponse("BillboardId is required", { status: 400 });
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
        // remove this if you got an error
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[BILLBOARD_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
