"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/lib/zod schema/onboardingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type{ CoverLetter } from "@prisma/client";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";



export default function Create_Cover_Letter_Page(){

  const router=useRouter()
  
  const {
    data:generatedLetter,
    loading:generatingCoverLetter,
    fn:generateCoverLetter_Fn,
    // setData:setCoverLetterData,
    // error:generateCoverLetterError
  }=useFetch<CoverLetter>("generateCoverLetter")

  const {register,handleSubmit,formState:{errors},}=useForm({
    resolver:zodResolver(coverLetterSchema)
  })

  useEffect(()=>{
     
    if(generatedLetter && !generatingCoverLetter){
      toast.success("Cover Letter Generated Successfully")
      router.push(`/ai-cover-letter/${generatedLetter.id}`)
    }
  },[generatedLetter,generatingCoverLetter])

  const onSubmit = async(data:{ companyName: string; jobTitle: string; jobDescription: string; }) => {
   try {
    await generateCoverLetter_Fn(data)
   } catch (error) {
    toast.error((error as Error).message || "Failed to generate Cover Letter")
   }
    
    
    
  };

  // const formDAta=watch()
  
  return (
   <div>
    
    <div className="space-y-6">
      <div>
       <Link href={"/ai-cover-letter"}>
       <Button variant={"link"} className="cursor-pointer">
        <ArrowLeft className="h-4 w-4"/>
        Back to Cover Letters
       </Button></Link>
       
      <h1 className="font-bold gradient-title text-[44px] md:text-6xl">
          Create Cover Letter
        </h1>
        <span className=" text-md text-muted-foreground">Genrate a tailored cover letter for your job application</span>
      </div>

      <Card className="rounded-[8px]">
  <CardHeader>
    <CardTitle>Job Details</CardTitle>
    <CardDescription>Provide information about the position you&apos;re applying for</CardDescription>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="space-y-2 w-full ">
          <Label htmlFor="companyName">Company Name</Label>
          <Input placeholder="Enter company name" id="companyName"  className="rounded-[8px]" {...register("companyName")}/>
          {
            errors.companyName && <span className="text-sm text-red-500">{errors.companyName.message}</span>
          }
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input placeholder="Enter job title" id="jobTitle" {...register("jobTitle")}  className="rounded-[8px] w-full"/>
          {
            errors.jobTitle && <span className="text-sm text-red-500">{errors.jobTitle.message}</span>
          }
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobDescription">Description</Label>
        <Textarea className="rounded-[8px] h-28" id="jobDescription"  {...register("jobDescription")} placeholder="Paste the job description here" />
        {
            errors.jobDescription && <span className="text-sm text-red-500">{errors.jobDescription.message}</span>
          }
      </div>
      
      <div className=" md:flex justify-end">
      <Button className="rounded-[8px] w-full md:w-auto cursor-pointer  " type="submit" disabled={generatingCoverLetter}>
      {
        generatingCoverLetter ? (
          <>
          <Loader2 className="animate-spin h-4 w-4 mr-2"/>
          Generating...
          </>
          
          
        ):(
          <>
          <Sparkles className="h-4 w-4"/>
          Generate Cover Letter
          </>
        )
      }
    </Button>
      </div>
      
      </div>
      
    </form>
  </CardContent>
 
 
</Card>
    </div>
   </div>
  )
}