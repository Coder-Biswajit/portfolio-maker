import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { PortfolioMediaType } from "@prisma/client";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");
  const portfolioFolder = join(process.cwd(), "public", "uploads", "portfolio");
  await mkdir(portfolioFolder, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;

  const path = join(portfolioFolder, filename);
  await writeFile(path, buffer);
  return NextResponse.json({
    type: getResourceType(file),
    url: `/uploads/portfolio/${filename}`,
  });
}

const getResourceType = (resource) => {
  if (resource.type.startsWith("image/")) return "image";
  if (resource.type.startsWith("video/")) return "video";
  if (resource.type.startsWith("application/pdf")) return "raw";
  return "raw";
};
