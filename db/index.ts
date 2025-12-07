import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({ adapter });
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;

// import { PrismaClient } from "../lib/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient;
// };

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });

// const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     adapter,
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export const db = prisma;
