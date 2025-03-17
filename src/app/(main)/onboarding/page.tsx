import { checkOnBoardedStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { OnBoardingForm } from "./_component/onBoarding-form";
import { industries } from "@/data/industries";




export default async function OnboardingPage(){

  //redirect if user already onbaorded
   // Check if user is already onboarded
   const { isOnboarded } = await checkOnBoardedStatus();

   //if user already onboarded redirect to dashboard
   if (isOnboarded) {
     redirect("/");
   }

  return(
    <main>
      <OnBoardingForm  industries={industries}/>
    </main>
  )
}