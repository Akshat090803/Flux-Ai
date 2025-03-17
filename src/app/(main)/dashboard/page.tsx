import { getIndustryInsights } from "@/actions/dashboard";
import { checkOnBoardedStatus } from "@/actions/user";
import type { IndustryInsight } from "@prisma/client";
import { redirect } from "next/navigation";
import DashBoardView from "./_component/DashBoardView";

export default async function DashBoardPage() {
  //redirect to onboarding page if user not onboarded
  // Check if user is already onboarded or not
  const { isOnboarded } = await checkOnBoardedStatus();
  const insights: IndustryInsight = await getIndustryInsights();

  //!if user not onboarded redirect to onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return (
   <div className="w-full mx-auto">
    <DashBoardView insights={insights}/>
   </div>
  );
}
