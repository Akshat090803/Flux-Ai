
// import { useState } from "react";
// import { toast } from "sonner";




// const useFetch = (cb) => {
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState<boolean | null>(false);
  // const [error, setError] = useState<Error | null>(null);

//   const fn = async (...args) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await cb(...args);
//       setData(response);
//       setError(null);
//     } catch (error) {
    //   if(error instanceof Error){
    //     toast.error(error.message);
    //   }
    //   setError(error as Error);
      
    // } finally {
    //   setLoading(false);
    // }
//   };

//   return { data, loading, error, fn, setData };
// };

// export default useFetch;



import { deleteCoverLetter, generateCoverLetter, getAllCoverLetters } from "@/actions/cover-letter";
import { generateQuiz, QuestionType, saveQuizResult } from "@/actions/interview";
import { generateJobListings } from "@/actions/job-listings";
import { improveWithAI, saveResume } from "@/actions/resume";
import { updateUser } from "@/actions/user";
import { valueType } from "@/app/(main)/onboarding/_component/onBoarding-form";
import { useState } from "react";
import { toast } from "sonner";




function useFetch<T>(funcName:string)  {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  //funcData2 , funcData3 is saveQuizResult Functions
  const fn = async (funcData?:valueType | QuestionType[] |unknown ,funcData2?:string[],funcData3?:number) => {
    setLoading(true);
    setError(null);
    let response;
    try {
      if(funcName==="updateUser"){
         response= await updateUser(funcData as valueType);
      }
      else if(funcName==="generateQuiz"){
        response=await generateQuiz()
      }
      else if(funcName==="saveQuizResult"){
        response=await saveQuizResult(funcData as QuestionType[],funcData2 as string[],funcData3 as number)
      }
      else if(funcName==="saveResume"){
        response =await saveResume(funcData as string)
      }
      else if(funcName==="improveWithAI"){
        response=await improveWithAI(funcData as { current: string; type: string; })
      }
      else if(funcName==="getAllCoverLetters"){
        response=await getAllCoverLetters()
      }
      else if(funcName==="generateCoverLetter"){
        response=await generateCoverLetter(funcData as { companyName: string; jobTitle: string; jobDescription: string; })
      }
      else if(funcName==="deleteCoverLetter"){
        response=await deleteCoverLetter(funcData as string)
      }
      else if(funcName==="getJobListings"){
        response=await generateJobListings()
      }
      

      
      setData(response);
      setError(null);
    } catch (error) {
      if(error instanceof Error){
        toast.error(error.message);
      }
      setError(error as Error);
      
    } finally {
      setLoading(false);
    }
   
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;




