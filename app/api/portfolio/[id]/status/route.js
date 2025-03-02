import { NextResponse } from "next/server";
import prisma from "@/configs/prisma";
export async function PUT(request, { params }) {
  const id = await params.id;
  const data = await request.formData();

  const portfolio = await prisma.portfolio.update({
    where: { id },
    data: { status: data.get("status") },
  });

  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Portfolio status updated successfully",
    data: portfolio,
  });
}
