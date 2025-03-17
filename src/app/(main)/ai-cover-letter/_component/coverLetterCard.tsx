"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { CoverLetter } from "@prisma/client";
import { format } from "date-fns";
import { Eye, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";



interface propType {
  letter: CoverLetter;
}

interface deleteCoverLetterInterface {success: boolean, message: string};

export default function CoverLetterCard({ letter }: propType) {

  const {
    loading:deleting,
    data:deleteResponse,
    fn:deleteLetterFn
  }=useFetch<deleteCoverLetterInterface>("deleteCoverLetter")
   

  async function deleteHandler(id:string){
        try {
          await deleteLetterFn(id)
          if(deleteResponse && deleteResponse.success){
            toast.success(deleteResponse.message)
            

          }
        } catch (error) {
          toast.error((error as Error).message || "Failed to delete cover letter")
        }
  }

  return (
    <div>
      <Card className="rounded-[8px]">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl gradient-title">
                {`${letter.jobTitle} at ${letter.companyName}`}
              </CardTitle>
              <CardDescription>{`Created ${format(
                new Date(letter.createdAt),
                "PPP"
              )}`}</CardDescription>
            </div>

            <div className="space-x-2 flex items-center">
              <Link href={`/ai-cover-letter/${letter.id}`}>
                <Button
                  className="rounded-[8px] cursor-pointer"
                  variant={"outline"}
                >
                  <Eye className=" h-4 w-4" />
                </Button>
              </Link>

              <AlertDialog >
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="rounded-[8px] cursor-pointer "
                    disabled={deleting}
                  >
                    {
                      deleting ?(
                        <Loader2 className="h-4 w-4 animate-spin"/>
                      ):(
                        <Trash2 className="h-4 w-4" />
                      )
                    }
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[8px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently
                        delete your cover letter for {letter.jobTitle} role at{" "}
                        {letter.companyName}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-[8px] cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="rounded-[8px] bg-red-800 hover:bg-red-900 text-white cursor-pointer" onClick={()=>deleteHandler(letter.id)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm line-clamp-3">
            {letter.jobDescription}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
