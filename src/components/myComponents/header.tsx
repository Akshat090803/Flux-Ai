// import {
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";

import Image from "next/image";
// import logo from "../../../public/logo.png";
import fluxLogo from "../../../public/flxfinal6.jpg";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  ChevronDown,
  Edit,
  FileTextIcon,
  GraduationCap,
  LayoutDashboardIcon,
 
  PenBox,
  Rotate3D,
  StarsIcon,
} from "lucide-react";
import { SignedIn, SignedOut,  UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,

  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import checkUser from "@/lib/checkUser";



async function Header() {

  await checkUser()
 
  return (
    <header className="flex w-full justify-between py-3 md:px-6 px-2 border-b shadow-lg fixed top-0 z-30 overflow-hidden bg-background
    ">
     <Link href={'/'} >
     <Image
        src={fluxLogo}
        width={60}
        height={40}
        alt="logo"
        className=" w-full mt-[3px] h-8  object-contain"
      /></Link>

      <nav className="flex gap-2">
        
        <SignedIn>
        <Link href="/onboarding/edit">
            <Button className="cursor-pointer rounded-[8px]" variant={"outline"}>
              <Edit  />
              <span className=" hidden lg:block">Edit</span>
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="cursor-pointer rounded-[8px]" variant={"outline"}>
              <LayoutDashboardIcon />
              <span className=" hidden lg:block">Industry Insights</span>
            </Button>
          </Link>

          <DropdownMenu >
            <DropdownMenuTrigger asChild  className="focus-visible:outline-none">
              <Button className="cursor-pointer focus-visible:outline-none rounded-[8px]" >
                <StarsIcon />
                <span className=" hidden lg:block">Growth Tools</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-auto cursor-pointer ">
              <DropdownMenuItem>
                <Link href={'/resume'} className="flex gap-2 items-center">
                <FileTextIcon className="h-4 w-4"/>
                <span>Resume</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
              <Link href={'/ai-cover-letter'} className="flex gap-2 items-center">
                <PenBox className="h-4 w-4"/>
                <span>Cover Letter</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
              <Link href={'/interview'} className="flex gap-2 items-center">
                <GraduationCap className="h-4 w-4"/>
                <span>Interview Prep</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
              <Link href={'/career-options'} className="flex gap-2 items-center">
                <Rotate3D className="h-4 w-4"/>
                <span>Career Options</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

         
        </SignedIn>


        <SignedOut>
        
          <Link href={'/sign-in'}>
            <Button variant={"outline"} className="cursor-pointer rounded-[8px]" >
              Sign In
            </Button>
          </Link>
        </SignedOut>

        <SignedIn>
        <UserButton appearance={{
            elements:{
              avatarBox:"w-10 h-10",
              userButtonPopoverCard:"shadow-xl",
              userPreviewMainIdentifier:"font-semibold"
            }
          }}  />
        </SignedIn>
      
      </nav>
    </header>
  );
}

export default Header;

// <header className="flex justify-end items-center p-4 gap-4 h-16">
//             <SignedOut>
//               <SignInButton />
//               <SignUpButton />
//             </SignedOut>
//             <SignedIn>
//               <UserButton />
//             </SignedIn>
//           </header>
