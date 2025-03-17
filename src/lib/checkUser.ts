"use server"
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prismaClient";



//!This function is to store details form clerk to userdb if user not recorded in db e
export  default async function checkUser(){
     const user=await currentUser();
     if(!user){
      console.log("-----------------------user not signined-------------------------------------")
      return null;
     }


     try {

      //check if Logged user detail present in db or not
      const loggeduser=await prisma.user.findUnique({
        where:{
          clerkUserId:user.id,
        }
      })
       
      //if user data already stored in db return logged user
      if(loggeduser){
        return loggeduser
      }

      //if user record not present in db
      //create new user

      const name=`${user.firstName} ${user?.lastName}`;
      
     
      const newUser = await prisma.user.create({
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress
        }
      })

      return newUser;
      
     } catch (error) {
       if(error instanceof Error){
        console.log(error.message)
       }
     }

}