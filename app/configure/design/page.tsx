import db from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const Page = async ({ searchParams }: PageProps) => {
  const { id } = await searchParams;

  if (!id || typeof id !== "string") return notFound();

  const config = await db.configuration.findUnique({
    where: { id },
  });

  if (!config) return notFound();

  const { imageUrl, width, height } = config;

  return (
    <DesignConfigurator
      configId={config.id}
      imageDimensions={{ width, height }}
      imageUrl={imageUrl}
    />
  );
};
export default Page;
