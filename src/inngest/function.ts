import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";
import { prisma } from "@/lib/prismaClient";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { id: "Genrate Industry Insights" },
  // {name:"Generate Industry Insights"},
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight

  async ({ step }) => {
    const industries = await step.run("Fetch Industries for db", async () => {
      return await prisma.industryInsight.findMany({
        select: {
          industry: true,
        },
      });
    });

    //!iterate over each industry and we will regenerate its data
    for (const { industry } of industries) {
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
      // const res = await step.ai.wrap(
      //   "Fetching through Gemini",
      //   async (p) => {
      //     return await model.generateContent(p);
      //   },
      //   prompt
      // );

      // const text: string = res.response.candidates[0].content.parts[0].text || "";
      // const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      
      // const insights = JSON.parse(cleanedText);

      // //!update insights data for industry
      // await step.run(`Update ${industry} insights`, async () => {
      //   await prisma.industryInsight.update({
      //     where: { industry },
      //     data: {
      //       ...insights,
      //       lastUpdated: new Date(),
      //       nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      //     },
      //   });
      // });
      //!Fetch results
      const res = await step.ai.wrap(
        "Fetching through Gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );

      if (
        res &&
        res.response &&
        res.response.candidates &&
        res.response.candidates.length > 0 &&
        res.response.candidates[0].content &&
        res.response.candidates[0].content.parts &&
        res.response.candidates[0].content.parts.length > 0
      ) {
        const parts = res.response.candidates[0].content.parts;
        let text: string = "";

        //!traversing each ele of parts array of object  and checking if "text" property exist.If exist than text += part.text;
        for (const part of parts) {
          if ("text" in part) {
            text += part.text;
          }
        }

        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        //!Update insights data for industry
        try {
          const insights = JSON.parse(cleanedText);

          await step.run(`Update ${industry} insights`, async () => {
            await prisma.industryInsight.update({
              where: { industry },
              data: {
                ...insights,
                lastUpdated: new Date(),
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            });
          });
        } catch (jsonError) {
          console.error(`Error parsing JSON for ${industry}:`, jsonError);
        }
      } else {
        console.error(`Gemini API returned an invalid response for ${industry}.`);
      }

    }
  }
);

// explain ****** in cron all possible value

// ***** in cron represents the full range of possible values for each of the five time fields in a cron expression. Let's break down each asterisk and its corresponding field:

// Cron Time Fields:

// A cron expression has five or six fields (seconds are optional, and most cron implementations use 5 fields):

// Minute (0-59)
// Hour (0-23)
// Day of the Month (1-31)
// Month (1-12 or JAN-DEC)
// Day of the Week (0-6 or SUN-SAT, where 0 or 7 represents Sunday)
// When you use an asterisk (*) in a field, it means "every possible value" for that field.

// Explanation of *****:

// * (Minute):
// Means "every minute" (0, 1, 2, ..., 59).
// * (Hour):
// Means "every hour" (0, 1, 2, ..., 23).
// * (Day of the Month):
// Means "every day of the month" (1, 2, 3, ..., 31).
// * (Month):
// Means "every month" (1, 2, 3, ..., 12 or JAN, FEB, ..., DEC).
// * (Day of the Week):
// Means "every day of the week" (0, 1, 2, ..., 6 or SUN, MON, ..., SAT).
// Therefore, ***** means "run the command every minute of every hour of every day of every month of every day of the week."

// In simpler terms, it means "run the command every minute."

// Example:

// If you have a cron job like this:

// Bash

// ***** /path/to/your/script.sh
// The script /path/to/your/script.sh will be executed every single minute.

// Important Notes:

// Running a cron job every minute can put a heavy load on your system, so use it with caution.
// If you need to run a job at a specific interval (e.g., every 5 minutes), you can use the / operator (e.g., */5 * * * *).
// Cron expressions can be more complex, allowing you to specify ranges, lists, and other patterns.
