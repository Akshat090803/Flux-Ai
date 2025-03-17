// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { getSingleCoverLetter } from "@/actions/cover-letter";
// import CoverLetterPreview from "../_component/letterPreview";


// export default async function EditCoverLetterPage({ params }:{params:{id:string}}) {
//   const { id } = await params;
//   const coverLetter = await getSingleCoverLetter(id);

//   return (
//     <div className=" py-6">
//       <div className="flex flex-col space-y-2">
//         <Link href="/ai-cover-letter">
//           <Button variant="link" className="gap-2 pl-0 cursor-pointer">
//             <ArrowLeft className="h-4 w-4" />
//             Back to Cover Letters
//           </Button>
//         </Link>

//         <h1 className="text-6xl font-bold gradient-title mb-6">
//           {coverLetter?.jobTitle} at {coverLetter?.companyName}
//         </h1>
//       </div>

//       <CoverLetterPreview content={coverLetter?.content} />
//     </div>
//   );
// }

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSingleCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_component/letterPreview";

export default async function EditCoverLetterPage( {params}:{params:Promise<{id:string}>}) {
  const { id } = await params; // Remove 'await' here
  const coverLetter = await getSingleCoverLetter(id);

  return (
    <div className=" py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <h1 className="text-6xl font-bold gradient-title mb-6">
          {coverLetter?.jobTitle} at {coverLetter?.companyName}
        </h1>
      </div>

      <CoverLetterPreview content={coverLetter?.content} />
    </div>
  );
}
