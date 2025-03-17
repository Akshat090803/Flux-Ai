"use server"

import { prisma } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

 export interface CareerPath {
  Role: string;
  Skills_to_develop: string[];
  Role_description: string;
  Average_salary: string; // or number, depending on how you want to handle it
}

export type CareerPathList = CareerPath[];

export async function generateJobListings(){

  const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");
    try {
      
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
      });

      
const prompt=`You are a career advisor. I will provide you with a user's skills, industry-subindustry, and bio. Your task is to analyze this information and generate a list of the top possible career paths for the user. Return the results as an array of JSON objects, where each object represents a career path and includes the following fields:

* **Role:** The name of the career role.
* **Skills to develop:** A list of additional skills the user needs to acquire beyond their current skillset to pursue this role. (Only list the skill names, no descriptions, no exmaples ,just skill names.)
* **Role description:** A concise description of the role's responsibilities. (description no longer than 2 lines)
* **Average salary:** The approximate average annual salary for this role in USD.

Here is the user's information:

User Skills: ${user.skills}
User Industry-Subindustry: ${user.industry}
User Bio: ${user?.bio}  (optional)

Return a maximum of 10 results in the following JSON format:

[
  {
    "Role": "...",
    "Skills_to_develop": ["...", "..."],
    "Role_description": "...",
    "Average_salary": "..."
  },
 {
    "Role": "...",
    "Skills_to_develop": ["...", "..."],
    "Role_description": "...",
    "Average_salary": "..."
  },
  {
    "Role": "...",
    "Skills_to_develop": ["...", "..."],
    "Role_description": "...",
    "Average_salary": "..."
  },
  // ... up to 10 career paths
]

Please ensure the 'Average salary' is a reasonable estimate based on the provided information and general market data. If the user's information is insufficient to determine suitable career paths, or if there are fewer than 10 suitable paths, return an array containing the available paths. If the user's information is insufficient to determine any suitable career paths, return an empty array.`

const result=await model.generateContent(prompt);
const response=result.response;
const response_in_text=response.text();

const cleanedText=response_in_text.replace(/```(?:json)?\n?/g, "").trim(); //used regualar expression remove ``` and other unnneccessary things and get only Json object

const parsedArr= JSON.parse(cleanedText) ; //convert JSON object to normal javascript object and return
console.log(parsedArr)
return parsedArr as CareerPathList;

    } catch (error) {
      console.log("Eror in fetching job listings",error)
    }
}