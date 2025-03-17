import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

//!createRouteMatcher([]) return a func that will match thee req among the provided routes
const isProtectedRoutes: (req:NextRequest) => boolean =createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
  "/career-options(.*)",
])


//!middleware provided by clerk
export default clerkMiddleware( async(auth,req)=>{

  //extracting userId form auth() provided by clerk
  const {userId}=await auth();

  //if userId not present and we try to access protected route than redirect to signIn page
  if(!userId && isProtectedRoutes(req)){
      const {redirectToSignIn}=await auth();
      return redirectToSignIn();
  }

  //else redirect to the requested page
  return NextResponse.next();

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};