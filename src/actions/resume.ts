"use server";


import { prisma } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });


export async function saveResume(content:string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await prisma.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await prisma.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }:{current:string,type:string}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // const prompt = `
  //   As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
  //   Make it more impactful, quantifiable, and aligned with industry standards.
  //   Current content: "${current}"
    

  //   Requirements:
  //   1. Use action verbs
  //   2. Include metrics and results where possible
  //   3. Highlight relevant technical skills
  //   4. Keep it concise but detailed
  //   5. Focus on achievements over responsibilities
  //   6. Use industry-specific keywords
    
  //   Format the response as a single paragraph without any additional text or explanations.
  // `;
  const prompt = `
  As an expert resume writer, improve the following ${type} description ${
    type === "experience" ? `for a ${user.industry} professional` : ""
  }.
  Make it more impactful, quantifiable, and aligned with industry standards.
  
  Current content: "${current}"

  Requirements:
  1. Use action verbs
  2. Include metrics and results where possible
  3. Highlight relevant technical skills (if applicable)
  4. Keep it concise but detailed
  5. Focus on achievements over responsibilities
  6. Use industry-specific keywords (if applicable)
  7. Keep the original intent and meaning intact as much as possible
  8. Use concise, professional, and engaging language
  9. Improve clarity, readability, and appeal
  10. Avoid unnecessary length or excessive details
  11. Use action-oriented and compelling phrasing

  Format the response as a single paragraph without any additional text or explanations.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}