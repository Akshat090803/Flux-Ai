"use server";

import { prisma } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";


const genAi=new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
const model=genAi.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function getAllCoverLetters() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    return await prisma.coverLetter.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.log("Error in fetching users coverLetter", error);
    throw new Error("Error in fetching users coverLetter");
  }
}

export async function generateCoverLetter(data:{ companyName: string; jobTitle: string; jobDescription: string; }) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
    
  const prompt = `
  Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.

  About the candidate:
  - Industry: ${user.industry}
  - Years of Experience: ${user.experience}
  - Skills: ${user.skills?.join(", ")} (These skills are for background information only.)
  - Professional Background: ${user.bio}

  Job Description:
  ${data.jobDescription}

  Requirements:
  1. Use a professional, enthusiastic tone.
  2. **Strictly highlight only skills and experience explicitly mentioned or directly implied in the "Job Description". Do not invent skills or achievements.**
  3. **From the candidate's skills, only highlight those that directly match skills explicitly mentioned or directly implied in the "Job Description". Do not include skills that are not a precise alignment.**
  4. Show understanding of the company's needs as described in the "Job Description".
  5. Keep it concise (max 400 words).
  6. Use proper business letter formatting in markdown.
  7. Include specific examples of achievements **that are relevant to the "Job Description" requirements**.
  8. Relate the candidate's background to the job requirements **as stated in the "Job Description"**.
  

  **Do not include any skills, experiences, or achievements that are not directly related to the "Job Description".**

   **Highlight any fields or phrases that require the user to input their specific information with bold markdown syntax (** **). This includes, but is not limited to, personal details like name, address, contact information, specific project details, or any information that would be unique to the applicant.**
   
  Format the letter in markdown.
`;
    
  try {
   
    const result=await model.generateContent(prompt);
    const response=result.response
    const  text=response.text();
    const cleanedText=text.trim();

    const coverLetter= await prisma.coverLetter.create({
      data:{
        userId:user.id,
        content:cleanedText,
        ...data,
        status:"completed"
      }
    })
    
    revalidatePath("/ai-cover-letter")
    return coverLetter
    
  } catch (error) {
    console.log("Error in fetching users coverLetter", error);
    throw new Error("Error in fetching users coverLetter");
    
  }
}

export async function getSingleCoverLetter(id:string){
  const {userId}= await auth()

  if(!userId)
    throw new Error("Unauthorized")

  const user=await prisma.user.findUnique({
    where:{
      clerkUserId:userId
    },
  })

  if(!user){
    throw new Error("User not found")
  }
   
  try {
    const coverLetter = await prisma.coverLetter.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    return coverLetter
    
  } catch (error) {
    console.log("Error in fetching users coverLetter", error);
    throw new Error("Error in fetching coverLetter using id");
  }
}




 export async function deleteCoverLetter(id:string){
   
  const {userId}= await auth()

  if(!userId)
    throw new Error("Unauthorized")

  const user=await prisma.user.findUnique({
    where:{
      clerkUserId:userId
    },
  })

  if(!user){
    throw new Error("User not found")
  }
   
  try {

    const existingCoverLetter=await prisma.coverLetter.findUnique({
      where:{
        id,
        userId:user.id
      }
    })

    if(!existingCoverLetter){
      throw new Error(`Cover letter not found or user does not own this cover letter. Cover letter ID: ${id}, user ID: ${user.id}`);
    }

    await prisma.coverLetter.delete({
      where:{
        id,
        userId:user.id
      }
    })
    revalidatePath('/ai-cover-letter')
    return {success: true, message: "Cover letter deleted successfully"};
    
  } catch (error) {
    console.log("Failed in Deleting  coverLetter", error);
    throw new Error("Failed in Deleting coverLetter");
  }
}