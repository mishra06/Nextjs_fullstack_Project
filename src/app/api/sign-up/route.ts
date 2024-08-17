
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST (req: Request){
    await dbConnect()

    try {
        const { username,email,password } = await req.json()

        // check if user already exists
        const existingUserByUsername = await UserModel.findOne({ username,isVerified:true })

        if(existingUserByUsername){
            return Response.json(
                {
                    success: false,
                    message: "User already exists"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isverified){
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists"
                    },
                    {
                        status: 400
                    }
                )
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                await existingUserByEmail.save()
            }
            
        } 
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isverified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }

       const emailResponse =  await sendVerificationEmail(email, username, verifyCode)

       if(!emailResponse.success){
        return Response.json(
            {
                success: false,
                message: emailResponse.message
            },
            {
                status: 500
            }
        )
       }
       return Response.json(
        {
            success: true,
            message: "user Registered Successfully. verify your email"
        },
        {
            status: 201
        }
    )
        
    } catch (error) {
        console.error("Error registring user",error)
        return Response.json(
            {
                success: false,
                message: "Error registring user"
            },
            {
                status: 500
            }
        )
    }
}