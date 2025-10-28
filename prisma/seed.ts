import { Channel, PrismaClient } from "../generated/prisma/client.js";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

const prisma = new PrismaClient();

async function parseCSV(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return new Promise((resolve, reject) => {
    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
        skip_records_with_error: true,
      },
      (error, records) => {
        if (error) reject(error);
        resolve(records);
      }
    );
  });
}

async function seed() {
  console.log("🚀 Seeding MongoDB...");
  await prisma.evaluation.deleteMany();
  await prisma.image.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleared existing data");

  const usersFile = path.join(process.cwd(), "data", "users.csv");
  const brandsFile = path.join(process.cwd(), "data", "brands.csv");
  const promptsFile = path.join(process.cwd(), "data", "prompts.csv");

  const users = await parseCSV(usersFile);
  const brands = await parseCSV(brandsFile);
  const prompts = await parseCSV(promptsFile);

  console.log("📌 Parsed CSV files");

  /** Seed Users */
  for (const u of users as {
    userId: string;
    userName: string;
    userRole: string;
  }[]) {
    await prisma.user.create({
      data: {
        userId: u.userId,
        userName: u.userName,
        userRole: "user",
      },
    });
  }

  console.log("✅ Users imported");
  // creating admin user
  await prisma.user.create({
    data: {
      userId: crypto.randomUUID(),
      userName: "admin",
      userRole: "admin",
      password: "test",
    },
  });

  /** Seed Brands */
  for (const b of brands as {
    brandId: string;
    brandName: string;
    brandDescription: string;
    style: string;
    brandVision: string;
    brandVoice: string;
    colors: string;
  }[]) {
    try {
      let colorsArray: string[] = [];
      if (b.colors && typeof b.colors === "string" && b.colors.trim()) {
        colorsArray = b.colors
          .split(",")
          .map((c: string) => c.trim())
          .filter((c) => c.length > 0);
      }

      await prisma.brand.create({
        data: {
          brandId: b.brandId,
          brandName: b.brandName,
          brandDescription: b.brandDescription,
          style: b.style,
          brandVision: b.brandVision,
          brandVoice: b.brandVoice,
          colors: colorsArray,
        },
      });
    } catch (error) {
      console.error(`❌ Failed to create brand: ${b.brandId}`, error);
      throw error;
    }
  }
  console.log("✅ Brands imported");

  for (const p of prompts as {
    userId: string;
    brandId: string;
    imagePath: string;
    prompt: string;
    LLM_Model: string;
    channel: string;
    timeStamp: string;
  }[]) {
    try {
      const user = await prisma.user.findUnique({
        where: { userId: p.userId },
      });
      const brand = await prisma.brand.findUnique({
        where: { brandId: p.brandId },
      });

      if (!user || !brand) {
        console.warn(
          `⚠️ Skipping record: missing user/brand for ${p.imagePath}`
        );
        continue;
      }

      await prisma.image.create({
        data: {
          imagePath: p.imagePath,
          prompt: p.prompt,
          model: p.LLM_Model,
          channel: p.channel as Channel,
          timestamp: new Date(p.timeStamp),
          userId: user.id,
          brandId: brand.id,
        },
      });
    } catch (error) {
      console.error(`❌ Failed to create image: ${p.imagePath}`, error);
    }
  }
  console.log("✅ Images imported");

  console.log("🎯 Seeding complete!");
}

seed()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Seed failed", err);
    prisma.$disconnect();
  });
