"use server"
import { prisma } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY) as string);
const model= genAI.getGenerativeModel({
  model:"gemini-2.5-flash-lite-preview-06-17"
})

export interface GeminiInsights {
  salaryRanges: {
    role: string;
    min: number;
    max: number;
    median: number;
    location: string;
  }[];
  growthRate: number;
  demandLevel: "High" | "Medium" | "Low";
  topSkills: string[];
  marketOutlook: "Positive" | "Neutral" | "Negative";
  keyTrends: string[];
  recommendedSkills: string[];
}

//!we will use this func in updateUser 
export  async function generateAiInsights(industry:string){

  const prompt = `
  Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
  {
    "salaryRanges": [
      { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
    ],
    "growthRate": number,
    "demandLevel": "High" | "Medium" | "Low",
    "topSkills": ["skill1", "skill2"],
    "marketOutlook": "Positive" | "Neutral" | "Negative",
    "keyTrends": ["trend1", "trend2"],
    "recommendedSkills": ["skill1", "skill2"]
  }
  
  IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
  Include at least 5 common roles for salary ranges.
  Growth rate should be a percentage.
  Include at least 5 skills and trends.
`;

const result=await model.generateContent(prompt);
const response=result.response;
const response_in_text=response.text();

const cleanedText=response_in_text.replace(/```(?:json)?\n?/g, "").trim(); //used regualar expression remove ``` and other unnneccessary things and get only Json object

return JSON.parse(cleanedText) as GeminiInsights; //convert JSON object to normal javascript object and return 
}



//!server action to get Industry Insights
export async function getIndustryInsights(){
  const {userId}=await auth();

  if(!userId){
    throw new Error("Unauthorized");
  }

  const user=await prisma.user.findUnique({
    where:{
      clerkUserId:userId
    },
    include: {
      industryInsight: true,
    },
  })

  if(!user){
    throw new Error("User not found");
  }
  
  try {

    //! If no insights exist, generate them
  if (!user.industryInsight){
    const insights  = await generateAiInsights(user.industry);
    const industryInsight = await prisma.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }
   
  //else if industry indights already present in user
  return user.industryInsight;  //return industryInsighst 

    
  } catch (error) {
    
    if(error instanceof Error){
      console.log("Error in getIndustryInsights server action: ",error.message)
    }else{
      console.log("Error in getIndustryInsights server action: ",error)
    }
    throw new Error("Error in getIndustryInsights server action: ",error as Error)
  }
}