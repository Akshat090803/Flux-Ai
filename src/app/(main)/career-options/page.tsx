"use client"

import { CareerPathList } from "@/actions/job-listings"
import useFetch from "@/hooks/use-fetch"
import { useEffect, useState } from "react"
import { BarLoader } from "react-spinners"
import CareerPathCard from "./_component/CareerPathCard"


export default  function CareerPath(){
  
  const {data:jobLists,
    loading:listLoading,
    fn:generateJobLists,
    setData:setJobList
   
  }=useFetch<CareerPathList>("getJobListings")


  // useEffect(()=>{
  //   const local_Data=localStorage.getItem("jobList")
  //   if(!local_Data){
  //     generateJobLists()
     
  //   }
  //   else{
  //     setJobList(JSON.parse(local_Data))
  //   }
  // },[])

  // useEffect(()=>{
  //  if(jobLists && !listLoading){
  //   localStorage.setItem("jobList",JSON.stringify(jobLists))
  //  }
  // },[jobLists,listLoading])
  const [initialLoad, setInitialLoad] = useState(true);

  // useEffect(() => {
  //   const local_Data = localStorage.getItem("jobList");
  //   if (!local_Data || local_Data.length==0) {
  //     generateJobLists();
  //     setInitialLoad(true);
  //   } else {
  //     setJobList(JSON.parse(local_Data));
  //     setInitialLoad(false);
  //   }
  // }, []);
  useEffect(() => {
    const local_Data = localStorage.getItem("jobList");
    if (!local_Data) {
      generateJobLists();
      setInitialLoad(true);
    } else {
      const parsedData = JSON.parse(local_Data);
      if (Array.isArray(parsedData) && parsedData.length === 0) {
        generateJobLists();
        setInitialLoad(true);
      } else {
        setJobList(parsedData);
        setInitialLoad(false);
      }
    }
  }, []);

  useEffect(() => {
    if (jobLists && !listLoading && initialLoad) {
      localStorage.setItem("jobList", JSON.stringify(jobLists));
      setInitialLoad(false);
    }
    // Remove the else if part.
  }, [jobLists, listLoading, initialLoad]);

  if(listLoading && !jobLists){
    return <div >
      <BarLoader  className="mt-4" width={"100%"} color="gray"/>
    </div>
  }

  

  return(
    <div >
 
        <div className="space-y-4">
          {
            (jobLists && jobLists.length>0) && (
              jobLists.map((item,ind)=>{
                return <CareerPathCard key={ind} career={item}/>
              })
            )
          }
        </div>
        
        
     
    </div>
  )

  
}