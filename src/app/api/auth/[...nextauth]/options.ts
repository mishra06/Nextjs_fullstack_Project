import {NextAuthOptions} from "next-auth";
import  CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials:{
                email:{ label:"Email", type: "text", placeholder:" mishra"},
                password:{label:"Password", type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                 const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier},
                            { userName: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("User not found");
                    }
                    if(!user.isverified){
                        throw new Error("User not verified");
                    }
                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                   if(isPasswordCorrect){
                    return user;
                   } else{
                        throw new Error('Incorrect Password')
                   }
                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ]
}