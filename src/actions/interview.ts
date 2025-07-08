"use server"
import { prisma } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type{ Assessment } from "@prisma/client";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });

export interface QuestionType {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface questionResultsType  {
  question: string
  answer: string
  userAnswer: string
  isCorrect: boolean
  explanation: string
};

//!This will genrate Quiz using gemini
export async function generateQuiz(){

  //!check user authenticated or not
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  //!if user not found
  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result=await model.generateContent(prompt);
    const response=result.response;
    const response_in_text=response.text();
    const cleanedText = response_in_text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions
    
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}


//!This function will save users quiz result in Assessment model
//?i.e, create  a new entry in Assesmnet model

// export async function saveQuizResult(questions:QuestionType[],answers:string[],score:number){
//            //!check user authenticated or not
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await prisma.user.findUnique({
//     where: { clerkUserId: userId },
//     select: {
//       industry: true,
//       skills: true,
//     },
//   });

//   //!if user not found
//   if (!user) throw new Error("User not found");

//   //!This questionResults array is for question field in Assessment model in prisma
//   // ? questions     Json[]    // Array of {question, answer, userAnswer, isCorrect}

//   const questionResults = questions.map((q, index) => ({
//     question: q.question,
//     answer: q.correctAnswer,
//     userAnswer: answers[index],
//     isCorrect: q.correctAnswer === answers[index],
//     explanation: q.explanation,
//   }));

//     // Get wrong answers
//     //we get all questions which are answered worng by user
//     const wrongAnswers = questionResults.filter((q) => !q.isCorrect);


//     //!Genrating improvement tip
//      // Only generate improvement tips if there are wrong answers

//   let improvementTip = null;

//   if (wrongAnswers.length > 0) { //!only generate improvement tip if there are some wrong answers by user

//     //!created a text of all wrong answers along with correct answer  and user's answers
//     const wrongQuestionsText = wrongAnswers
//       .map(
//         (q) =>
//           `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
//       )
//       .join("\n\n");

//     const improvementPrompt = `
//       The user got the following ${user.industry} technical interview questions wrong:

//       ${wrongQuestionsText}

//       Based on these mistakes, provide a concise, specific improvement tip.
//       Focus on the knowledge gaps revealed by these wrong answers.
//       Keep the response under 2 sentences and make it encouraging.
//       Don't explicitly mention the mistakes, instead focus on what to learn/practice.
//     `;
   
//     //!using gemini genrate a imporvement tip and prompt will be improvementPrompt
//     try {
//       const tipResult = await model.generateContent(improvementPrompt);

//       improvementTip = tipResult.response.text().trim();
//       console.log(improvementTip);
//     } catch (error) {
//       console.error("Error generating improvement tip:", error);
//       // Continue without improvement tip if generation fails
//     }
//     }

//     //?the above part of creating improvemnt prompt and t=improvemnt tip will only run when there are some wrong answers by user
     
//     //!Create a new entry in assessment Model
//     try {
//       const assessment = await prisma.assessment.create({
//         data: {
//           userId: user.id,
//           quizScore: score,
//           questions: questionResults,
//           category: "Technical",
//           improvementTip,
//         },
//       });
  
//       return assessment;
//     } catch (error) {
//       console.error("Error saving quiz result:", (error as Error)?.message);
//       throw new Error("Failed to save quiz result "+(error as Error)?.message);
//     }
  
// } 



// export async function saveQuizResult(
//   questions: QuestionType[],
//   answers: string[],
//   score: number
// ) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await prisma.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   const questionResults = questions.map((q, index) => ({
//     question: q.question,
//     answer: q.correctAnswer,
//     userAnswer: answers[index],
//     isCorrect: q.correctAnswer === answers[index],
//     explanation: q.explanation,
//   }));

//   const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

//   let improvementTip = null;

//   if (wrongAnswers.length > 0) {
//     const wrongQuestionsText = wrongAnswers
//       .map(
//         (q) =>
//           `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
//       )
//       .join("\n\n");

//     const improvementPrompt = `
//       The user got the following ${user.industry} technical interview questions wrong:

//       ${wrongQuestionsText}

//       Based on these mistakes, provide a concise, specific improvement tip.
//       Focus on the knowledge gaps revealed by these wrong answers.
//       Keep the response under 2 sentences and make it encouraging.
//       Don't explicitly mention the mistakes, instead focus on what to learn/practice.
//     `;

//     try {
//       const tipResult = await model.generateContent(improvementPrompt);
//       improvementTip = tipResult.response.text().trim();
//       console.log(improvementTip);
//     } catch (error) {
//       console.error("Error generating improvement tip:", error);
//     }
//   }

//   try {
//     const assessment = await prisma.assessment.create({
//       data: {
//         userId: user.id, // Use the user's internal ID
//         quizScore: score,
//         questions: questionResults,
//         category: "Technical",
//         improvementTip,
//       },
//     });

//     return assessment;
//   } catch (error) {
//     console.error("Error saving quiz result:", (error as Error)?.message);
//     throw new Error("Failed to save quiz result " + (error as Error)?.message);
//   }
// }

export async function saveQuizResult(
  questions: QuestionType[], // Array of questions from the quiz
  answers: string[], // Array of user's answers to the questions
  score: number // The user's score on the quiz
) {
  // Check if the user is authenticated using Clerk
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized"); // Throw error if not authenticated

  // Retrieve the user from the database using their Clerk user ID
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  // Throw an error if the user is not found in the database
  if (!user) throw new Error("User not found");

  // Create an array of question results, including user's answers and correctness
  //   //!This questionResults array is for question field in Assessment model in prisma
  // ? questions     Json[]    // Array of {question, answer, userAnswer, isCorrect}

  const questionResults:questionResultsType[] = questions.map((q, index) => ({
    question: q.question, // The question text
    answer: q.correctAnswer, // The correct answer
    userAnswer: answers[index], // The user's answer
    isCorrect: q.correctAnswer === answers[index], // Whether the user's answer was correct
    explanation: q.explanation, // Explanation of the answer
  }));

  // Filter out the questions that the user answered incorrectly
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Initialize improvementTip to null (no tip initially)
  let improvementTip = null;

  //! Generate an improvement tip only if there are wrong answers
  if (wrongAnswers.length > 0) {
    // Create a text string of the wrong answers for the prompt
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    // Create the prompt for the Gemini model, including user's industry and wrong answers
    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    // Use Gemini model to generate an improvement tip
    try {
      const tipResult = await model.generateContent(improvementPrompt);
      improvementTip = tipResult.response.text().trim(); // Extract and trim the tip
      console.log(improvementTip); // Log the tip for debugging
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  // Create a new entry in the Assessment model in the database
  try {
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id, // Use the user's internal ID
        quizScore: score, // The user's quiz score
        questions: questionResults, // The array of question results
        category: "Technical", // The category of the assessment (e.g., Technical)
        improvementTip, // The generated improvement tip (or null)
      },
    });

    return assessment; // Return the created assessment object
  } catch (error) {
    console.error("Error saving quiz result:", (error as Error)?.message); // Log error
    throw new Error("Failed to save quiz result " + (error as Error)?.message); // Throw error
  }
}


//!for /interview page
//?will return all the assesments taken by user
export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments:Assessment[] = await prisma.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}