import { getAllCoverLetters } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import type { CoverLetter } from "@prisma/client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import CoverLetterCard from "./_component/coverLetterCard";
import NoCoverLetter_By_User from "./_component/noLetter";

export default async function Ai_Cover_Letter_Page(){

  const coverLetters:CoverLetter[]=await getAllCoverLetters();

 

  
  return (
    <div>
      <div>
      <div className="flex justify-between items-center mb-5">
      <h1 className="font-bold gradient-title text-[44px] md:text-6xl">
          My Cover Letters
        </h1>

       <Link href={"/ai-cover-letter/new"}>
       <Button className="rounded-[8px] cursor-pointer font-semibold">
          <PlusIcon></PlusIcon>
          Create New
        </Button></Link>
      </div>

        <div className="space-y-4">
          {
            
           (coverLetters && coverLetters.length>0 )? coverLetters.map((item:CoverLetter,ind)=>{
            return( 
             <CoverLetterCard key={ind} letter={item}/>
            )
          }):(
            <NoCoverLetter_By_User/>
          )
          }
        </div>
      </div>
    </div>
  )
}
