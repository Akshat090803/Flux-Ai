import { industries } from "@/data/industries";

import { EditOnBoardingForm } from "../_component/editOnboardingForm";
import { getUser } from "@/actions/user";



export default async function Edit(){

   const user=await getUser()
   const {industry,bio,experience}=user
   const skillArr=user.skills;
   const skills=skillArr.join(',')
   const ind_arr=industry?.split('-')
   let subIndustry=""
   if(ind_arr){
    for(let i=1;i<ind_arr?.length;i++){
      if(i>0){
        const [firstChar, ...restChars] =ind_arr[i];
        const cap=firstChar?.toUpperCase() + restChars.join("");
        subIndustry=subIndustry+cap+" "
      }
     }
   }
   
   const selectedIndustry =industries?.find((item)=>(
    item.id==(ind_arr as string[])[0]
   ))

 

  

 
  return (
    <div>
      <EditOnBoardingForm industries={industries} industry={selectedIndustry} bio={bio} experience={experience} skills={skills} subIndustry={subIndustry.trim()}  />
    </div>
  )
}
