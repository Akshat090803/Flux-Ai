"use server";

import { prisma } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import type{User} from "@prisma/client"
import { generateAiInsights } from "./dashboard";

export type parameterType = {
  // industry: string;
  // experience?: number;
  // bio?: string;
  // skills: string[];
  bio?: string; // Make bio optional
  industry: string;
  experience: number;
  subIndustry: string;
  skills?: string[]; // Make skills optional
};

export async function updateUser(data: parameterType) {
  //take userId  form clerk
  const { userId } = await auth(); //we can use currentUser() also

  //if userId null means user is unauthorized
  if (!userId) {
    throw new Error("Unauthorized User");
  }

  //if userId present , try to check if user with such userId present or not in db
  const user :User | null = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  //if user with that userId not found in db , throw error
  if (!user) throw new Error("User not found");

  try {
    //we put all task we want to perform in a transaction
    //transactions one of the property is atomicity i.e, either complete or fail
    //?so if any of task inside fail it will roll back i.e, all task need to complete for success

    //starting a transaction to handle oth tasks
    const result = await prisma.$transaction(
      async (tx: typeof prisma) => {

        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values 
        //later we will create using gemini
        if (!industryInsight) {
          // industryInsight = await tx.industryInsight.create({
          //   data: {
          //     industry: data.industry,
          //     salaryRanges: [],
          //     growthRate: 0, // Industry growth rate
          //     demandLevel: "Medium", // "High", "Medium", "Low"
          //     topSkills: [],
          //     marketOutlook: "Neutral",
          //     keyTrends: [],

          //     recommendedSkills: [],
          //     nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //after 7 days
          //   },
          // });

          //!creaing using gemini
               const insights  = await generateAiInsights(data.industry);
               industryInsight = await tx.industryInsight.create({
                data: {
                  industry: data.industry,
                  ...insights,
                  nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
              });
          
        }

        //!now update the user
        // Now update the user
        const updatedUser:User = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data?.industry,
            experience: data?.experience,
            bio: data?.bio,
            skills: data?.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000, // default: 5000
      }
    );

   return {success:true , ...result};

  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating user and industry:", error.message);
    } else {
      console.log("Error updating user and industry:", error);
    }
    throw new Error("Failed to update profile");
  }
}



//! Checking Onboarding status so that if user already onboarded , redirect it to dashboard and if user not onbaorded, redirect it to /onboarding page

export async function checkOnBoardedStatus(){

  const {userId}=await auth();

  if (!userId) throw new Error("Unauthorized");

  // const user:User | null = await prisma.user.findUnique({
  //   where: { clerkUserId: userId },
  // });

  // if (!user) throw new Error("User not found");

  try {

    const user=await prisma.user.findUnique({
      where:{
        clerkUserId:userId
      },
      select:{
        industry:true
      }
    })

    
    return {
      isOnboarded: !! user?.industry, //The double exclamation mark (!!) in JavaScript is used to coerce a value into a boolean
    };


    
  } catch (error:unknown) {
    if (error instanceof Error) {
      console.error("Error checking onboarding status (check user.ts checkOnboardingStatus func):", error.message);
      
    } else {
      console.log("Error checking onboarding status (check user.ts checkOnboardingStatus func):", error);
     
    }
    throw new Error("Failed to update profile (check user.ts checkOnboardingStatus func)" , error as Error);
    
  }

}



export async function getUser(){
  const {userId}=await auth();

  if (!userId) throw new Error("Unauthorized");

  const user:User | null = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return user
}







// curl https://api.theirstack.com/v1/jobs/search \
//   --request POST \
//   --header 'Content-Type: application/json' \
//   --header 'Authorization: Bearer asdfasd' \
//   --data '{
//   "page": 0,
//   "limit": 25,
//   "job_country_code_or": [
//     "US"
//   ],
//   "posted_at_max_age_days": 7
// }'