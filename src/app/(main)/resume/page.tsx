import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_component/resume-builder";
import { Resume } from "@prisma/client";


export default async function ResumePage() {
  const resume:Resume = await getResume();

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}