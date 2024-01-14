import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();

// decide when to use globalThis or is it safe to a new prismaClient
if (process.env.NODE_ENV === "development") globalThis.prisma = prismadb;

export default prismadb;
