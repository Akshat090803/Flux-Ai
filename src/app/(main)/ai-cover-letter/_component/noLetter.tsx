import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function NoCoverLetter_By_User(){

  return(
    <div className="container ">
       <Card className="rounded-[8px] ">
        <CardHeader>
          <CardTitle>No Cover Letters Yet</CardTitle>
          <CardDescription>
            Create your first cover letter to get started
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  
  )
}