import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();

if (process.env.APP_ENV === "development") global.prisma = prisma;

export default prisma;
