import { CareerPath } from "@/actions/job-listings";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


// export default function  CareerPathCard({career}:{career:CareerPath}){
//   return(
    
//     <Card className="rounded-[8px]">
//   <CardHeader>
//     <CardTitle>{career.Role}</CardTitle>
//     <CardDescription>Expect an average annual salary of {`💲${career.Average_salary}`}</CardDescription>
//   </CardHeader>
//   <CardContent>
//     <span>Role Description</span>
//     <p className="text-[#A0A0A0]">{career.Role_description}</p>
//   </CardContent>
//   <CardFooter className="flex flex-col items-start">
//     <span className="mb-1">Skills To Develop</span>
//     <div className="flex flex-wrap gap-2">
//       {
//         career.Skills_to_develop.map((item,ind)=>{
//           return <Badge key={ind} variant="secondary" className="rounded-[8px]">{item}</Badge>
//         })
//       }
//     </div>
//   </CardFooter>
// </Card>

//   )
// }


// {
//   Role: 'Cloud Security Engineer',
//   Skills_to_develop: [
//     'AWS Security Hub',
//     'Azure Security Center',
//     'GCP Security Command Center',
//     'Cloud security certifications (e.g., AWS Certified Security - Specialty)',
//     'IAM'
//   ],
//   Role_description: 'Focuses on securing cloud environments. Designs and implements security controls for cloud-based infrastructure and applications.',
//   Average_salary: '135000'
// }


export default function CareerPathCard({ career }: { career: CareerPath }) {
  return (
    <Card className="rounded-[8px]">
      <CardHeader>
        <CardTitle>{career.Role}</CardTitle>
        <CardDescription>Expect an average annual salary of {`💲${career.Average_salary}`}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <span>Role Description</span>
        <p className="text-[#A0A0A0] overflow-wrap: break-word">{career.Role_description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <span className="mb-1">Skills To Develop</span>
        <div className="flex flex-wrap gap-2">
          {career.Skills_to_develop.map((item, ind) => {
            return (
              <Badge
                key={ind}
                variant="secondary"
                className="rounded-[8px] text-truncate text-ellipsis "
              >
                {item}
              </Badge>
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
