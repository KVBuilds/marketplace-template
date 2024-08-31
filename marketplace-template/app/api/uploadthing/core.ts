import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import sharp from 'sharp';
import fetch from 'node-fetch';  // Ensure node-fetch or similar is installed
import fs from 'fs';
import path from 'path';

const f = createUploadthing();

// Ensure you have a directory for storing optimized images
const optimizedDir = path.join(process.cwd(), 'uploads', 'optimized');
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      // Fetch the image from the URL
      const response = await fetch(file.url);
      if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);

      // Buffer the response
      const buffer = await response.buffer();
      const fileName = path.basename(file.url);  // Extract the file name from the URL
      const filePath = path.join(process.cwd(), 'uploads', fileName);

      // Save the image locally
      fs.writeFileSync(filePath, buffer);

      // Path to save the optimized image
      const optimizedFilePath = path.join(optimizedDir, fileName);

      try {
        // Perform image optimization with sharp
        await sharp(filePath)
          .resize({ width: 1200 })  // Example resizing to a max width of 1200px
          .jpeg({ quality: 80 })    // Example converting to JPEG with 80% quality
          .toFile(optimizedFilePath);

        console.log("Optimized image saved to:", optimizedFilePath);
      } catch (error) {
        console.error("Error during image optimization:", error);
      }

      return { uploadedBy: metadata.userId };
    }),

  bannerImageRoute: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      // Fetch the image from the URL
      const response = await fetch(file.url);
      if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);

      // Buffer the response
      const buffer = await response.buffer();
      const fileName = path.basename(file.url);  // Extract the file name from the URL
      const filePath = path.join(process.cwd(), 'uploads', fileName);

      // Save the image locally
      fs.writeFileSync(filePath, buffer);

      // Path to save the optimized image
      const optimizedFilePath = path.join(optimizedDir, fileName);

      try {
        // Perform image optimization with sharp
        await sharp(filePath)
          .resize({ width: 1200 })
          .jpeg({ quality: 80 })
          .toFile(optimizedFilePath);

        console.log("Optimized image saved to:", optimizedFilePath);
      } catch (error) {
        console.error("Error during image optimization:", error);
      }

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
