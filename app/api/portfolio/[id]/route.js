import prisma from "@/configs/prisma";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import { Buffer } from "buffer";

export async function GET(_, { params }) {
  try {
    const id = await params.id;
    const response = await prisma.portfolio.findFirst({
      where: { id },
      include: {
        media: true,
      },
    });

    response.media.map((item) => {
      item.preview = item.mediaUrl;
      item.title = item.urlTitle;
      item.media_url = item.mediaUrl;
      return item;
    });

    if (!response) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const data = await req.formData();
    const { id } = await params;

    // Handle thumbnail
    const thumbnail = data.get("thumbnail");
    let thumbnailUrl = data.get("thumbnail");

    if (thumbnail && thumbnail instanceof File) {
      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      const portfolioFolder = join(process.cwd(), "public", "uploads", "portfolio");
      await mkdir(portfolioFolder, { recursive: true });
      const filename = `${Date.now()}_${thumbnail.name}`;
      const path = join(portfolioFolder, filename);
      await writeFile(path, buffer);
      thumbnailUrl = `/uploads/portfolio/${filename}`;
    }

    const media = JSON.parse(data.get("media"));

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        projectTitle: data.get("projectTitle"),
        role: data.get("role"),
        projectDescription: data.get("projectDescription"),
        skillsDeliverables: data.get("skillsDeliverables"),
        status: data.get("status"),
        thumbnail: thumbnailUrl,
        media: {
          deleteMany: {},
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

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Portfolio update error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    const { id } = await params;


    const portfolio = await prisma.portfolio.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Portfolio deletion error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

const getResourceType = (resource) => {
  if (resource.type.startsWith("image/")) return "image";
  if (resource.type.startsWith("video/")) return "video";
  if (resource.type.startsWith("application/pdf")) return "raw";
  if (resource.type.startsWith("audio/")) return "raw";
  // Default to raw if none of the above match
  return "auto";
};
