// import CustomBarLoader from "@/components/myComponents/MyCustomBarLoader";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";


export default function CoverLetterLayout({children}:{children:React.ReactNode}){

  return (
    <div className="px-5 space-y-4">
     
     
      <Suspense

        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
   
    </div>
  );

}