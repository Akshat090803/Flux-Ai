"use client"
import Image from "next/image";
import banner from "../../../public/banner.jpeg";
import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
// import lastMessage1 from "../../../public/lastMessage1.mp4"
export default function HeroSection() {

  const imageRef=useRef<HTMLDivElement>(null);
  const {user}=useUser()

  if(!user){
    localStorage.setItem("jobList",JSON.stringify([]))
  }

  //!Both useEffect will work similar 

  useEffect(() => {
    const imageElement:HTMLDivElement | null = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100; //this tell that if we have scrolled more than 100 unit than we will add scrolled class to image ,see below if condition

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);




  return (
    <section className="  pt-36 md:pt-48 pb-10 ">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="gradient-title text-[44px] md:text-6xl lg:text-7xl xl:text-8xl font-bold ">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          

          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl px-2 md:px-0 ">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>

        <div className="space-x-4 flex items-center justify-center">
          <Link href={"/dashboard"}>
            <Button size="lg" className="px-8 cursor-pointer rounded-[8px] ">
              Get Started
            </Button>
          </Link>

         
          <Dialog>
  <DialogTrigger asChild>
  <Button variant={"outline"} size="lg" className="px-8 cursor-pointer rounded-[8px]">
              Watch Demo
            </Button>
  </DialogTrigger>
  <DialogContent className="rounded-[8px]">
    <DialogHeader>
      <DialogTitle className="mb-2">Demo Video
        
      </DialogTitle>
      <DialogDescription>
      <video className="rounded-[8px]" width="640" height="360" controls >
      <source src="/demovVideo3.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
           
    
        </div>

        <div className="mt-5 md:mt-0 hero-image-wrapper">
          <div className="hero-image" ref={imageRef}>
            <Image
              src={banner}
              alt="Dashbord preview"
              height={720}
              width={1280}
              className="rounded-lg border shadow-2xl mx-auto "
              priority
              
            />
           
          </div>
        </div>
      </div>
    </section>
  );
}
