import prisma from "@/configs/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const contentType = formData.get("contentType");
    const portfolioId = id;
    const createdAt = new Date();

    let content;
    switch (contentType) {
      case "image":
        const image = formData.get("file");
        if (!image) throw new Error("No image file provided");

        const imageBytes = await image.arrayBuffer();
        const imageBuffer = Buffer.from(imageBytes);
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "vercel_uploads/portfolio", resource_type: "auto" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(imageBuffer);
        });
        const imageurlData = result.secure_url;
        content = await prisma.portfolioImage.create({
          data: {
            portfolioId,
            imageUrl: imageurlData,
            createdAt,
          },
        });
        break;

      case "video":
        const video = formData.get("file");
        if (!video) throw new Error("No video file provided");

        const videoBytes = await video.arrayBuffer();
        const videoBuffer = Buffer.from(videoBytes);
        // const videoName = `${Date.now()}_${video.name}`;
        // const videoPath = join(
        //   process.cwd(),
        //   "public",
        //   "uploads",
        //   "portfolio",
        //   videoName
        // );
        // await writeFile(videoPath, videoBuffer);

        const videoresult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "vercel_uploads/portfolio", resource_type: "auto" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(videoBuffer);
        });
        const videoUrlData = videoresult.secure_url;
        // const videoUrlData = `/uploads/portfolio/${videoName}`;
        content = await prisma.portfolioVideo.create({
          data: {
            portfolioId,
            videoUrl: videoUrlData,
            createdAt,
          },
        });
        break;

      case "textBlock":
        const heading = formData.get("heading");
        const description = formData.get("description");
        if (!heading || !description)
          throw new Error("Heading and description are required");

        content = await prisma.portfolioTextBlock.create({
          data: {
            portfolioId,
            heading,
            description,
            createdAt,
          },
        });
        break;

      case "link":
        const url = formData.get("url");
        const title = formData.get("title");
        if (!url) throw new Error("URL is required");

        content = await prisma.portfolioLink.create({
          data: {
            portfolioId,
            url,
            title,
            createdAt,
          },
        });
        break;

      case "pdf":
        const pdf = formData.get("file");
        const pdfTitle = formData.get("title");
        if (!pdf) throw new Error("No PDF file provided");

        const pdfBytes = await pdf.arrayBuffer();
        const pdfBuffer = Buffer.from(pdfBytes);
        // const pdfName = `${Date.now()}_${pdf.name}`;
        // const pdfPath = join(
        //   process.cwd(),
        //   "public",
        //   "uploads",
        //   "portfolio",
        //   pdfName
        // );
        // await writeFile(pdfPath, pdfBuffer);
        const pdfresult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "vercel_uploads/portfolio", resource_type: "raw" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(pdfBuffer);
        });
        const pdfUrlData = pdfresult.secure_url;
        // const pdfUrlData = `/uploads/portfolio/${pdfName}`;
        content = await prisma.portfolioPdf.create({
          data: {
            portfolioId,
            pdfUrl: pdfUrlData,
            title: pdfTitle,
            createdAt,
          },
        });
        break;

      case "audio":
        const audio = formData.get("file");
        const audioTitle = formData.get("title");
        if (!audio) throw new Error("No audio file provided");

        const audioBytes = await audio.arrayBuffer();
        const audioBuffer = Buffer.from(audioBytes);
        // const audioName = `${Date.now()}_${audio.name}`;
        // const audioPath = join(
        //   process.cwd(),
        //   "public",
        //   "uploads",
        //   "portfolio",
        //   audioName
        // );
        // await writeFile(audioPath, audioBuffer);
        const audioresult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "vercel_uploads/portfolio", resource_type: "raw" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(audioBuffer);
        });
        const audioUrlData = audioresult.secure_url;
        // const audioUrlData = `/uploads/portfolio/${audioName}`;
        content = await prisma.portfolioAudio.create({
          data: {
            portfolioId,
            audioUrl: audioUrlData,
            title: audioTitle,
            createdAt,
          },
        });
        break;

      default:
        throw new Error("Invalid content type");
    }

    return NextResponse.json(
      { message: "Content added successfully", content },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add content", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get("contentType");
    const contentId = searchParams.get("contentId");

    if (!contentType || !contentId) {
      throw new Error("Content type and ID are required");
    }

    let deleteResult;
    switch (contentType) {
      case "image":
        deleteResult = await prisma.portfolioImage.delete({
          where: { id: contentId },
        });
        break;
      case "video":
        deleteResult = await prisma.portfolioVideo.delete({
          where: { id: contentId },
        });
        break;
      case "textBlock":
        deleteResult = await prisma.portfolioTextBlock.delete({
          where: { id: contentId },
        });
        break;
      case "link":
        deleteResult = await prisma.portfolioLink.delete({
          where: { id: contentId },
        });
        break;
      case "pdf":
        deleteResult = await prisma.portfolioPdf.delete({
          where: { id: contentId },
        });
        break;
      case "audio":
        deleteResult = await prisma.portfolioAudio.delete({
          where: { id: contentId },
        });
        break;
      default:
        throw new Error("Invalid content type");
    }

    return NextResponse.json(
      { message: "Content deleted successfully", deleteResult },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete content", details: error.message },
      { status: 500 }
    );
  }
}
