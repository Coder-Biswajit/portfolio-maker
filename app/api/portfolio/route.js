import prisma from "@/configs/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { Status } from "@prisma/client";
export async function POST(request) {
  try {
    const formData = await request.formData();
    const thumbnail = formData.get("thumbnail");
    let url = null;
    if (thumbnail && thumbnail instanceof File) {
      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      const portfolioFolder = join(process.cwd(), "public", "uploads", "portfolio");
      await mkdir(portfolioFolder, { recursive: true });
      const filename = `${Date.now()}_${thumbnail.name}`;
      const path = join(portfolioFolder, filename);
      await writeFile(path, buffer);
      url = `/uploads/portfolio/${filename}`;
    }

    const media = JSON.parse(formData.get("media"));
    const response = await prisma.portfolio.create({
      data: {
        projectTitle: formData.get("projectTitle"),
        projectDescription: formData.get("projectDescription"),
        skillsDeliverables: formData.get("skillsDeliverables"),
        role: formData.get("role"),
        thumbnail: url,
        status: formData.get("status") ?? Status.DRAFT,
        media: {
          createMany: {
            data: media.map((media, index) => ({
              url: media.url,
              urlTitle: media.title,
              type: media.type,
              mediaUrl: media.media_url,
              heading: media.heading,
              description: media.description,
              position: index,
            })),
          },
        },
      },
      include: {
        media: true,
      },
    });
    return NextResponse.json({
      message: "Portfolio created successfully",
      portfolio: response,
    });
  } catch (error) {
    console.error("Portfolio creation error:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = {};
    if (status) {
      where.status = status;
    }

    const portfolios = await prisma.portfolio.findMany({
      where,
      include: {
        media: true,
      },
    });

    return NextResponse.json({ portfolios });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch portfolios", details: error.message },
      { status: 500 }
    );
  }
}

const getResourceType = (resource) => {
  if (resource.type.startsWith("image/")) return "image";
  if (resource.type.startsWith("video/")) return "video";
  if (resource.type.startsWith("application/pdf")) return "raw";
  return "raw";
};
