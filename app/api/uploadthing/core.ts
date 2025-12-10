import { createUploadthing, type FileRouter } from "uploadthing/next";
import { config, z } from "zod";
import sharp from "sharp";
import db from "@/db";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;
      console.log("onUploadComplete: ", file);
      const res = await fetch(file.ufsUrl);
      const buffer = await res.arrayBuffer();

      const imgMetadata = await sharp(buffer).metadata();
      const { width, height } = imgMetadata;
      console.log("configId: ", configId);
      if (!configId) {
        console.log("create");

        // const configuration = await db.configuration.create({
        //   data: {
        //     imageUrl: file.ufsUrl,
        //     height: height || 500,
        //     width: width || 500,
        //   },
        // });
        // console.log("finish : ", { configId: configuration.id });

        console.log("About to create configuration");
        try {
          const configuration = await db.configuration.create({
            data: {
              imageUrl: file.ufsUrl,
              height: height || 500,
              width: width || 500,
            },
          });
          console.log("Created configuration:", configuration.id);
          return { configId: configuration.id };
        } catch (err) {
          console.error("DB create error:", err);
          // return an error-shaped serverData so client doesn't hang
          return { error: "db-create-failed" };
        }
      } else {
        console.log("update");

        const updatedConfiguration = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.ufsUrl,
          },
        });
      }
      console.log(configId);
      return { configId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
