import { z } from "zod";


export const coverLetterSchema = z.object({
  jobTitle: z.string({
    required_error: "Job title is required.",
  }),
  jobDescription: z.string({
    required_error: "Job description is required.",
  }).min(10, "Description must be at least 10 characters long."),
  companyName: z.string({
    required_error: "Company name is required.",
  }),
});




// model CoverLetter {
//   id              String    @id @default(cuid())
//   userId          String
//   user            User      @relation(fields: [userId], references: [id])
//   content         String    // Markdown content
//   jobDescription  String?
//   companyName     String    // Name of the company applying to
//   jobTitle        String    // Position applying for
//   status          String    @default("draft") // draft, completed
//   createdAt       DateTime  @default(now())
//   updatedAt       DateTime  @updatedAt

//   @@index([userId])   //create a index table  on user id which make faster to search on  basisi of userId
// }
