import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export async function POST(request: Request){
    await dbConnect()

    try {
        const {username , code} = await request.json()

        const queryParam = {
            username //username: username
        }
        const result = UsernameQuerySchema.safeParse(queryParam)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
                },
                {
                    status: 400
                }
            )
        }

        const decodedUsername = decodeURIComponent(username) //decodes the username like %20 for space
        const user = await UserModel.findOne({
            username: decodedUsername,
            isVerified: false
        })

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found or already verified"
                },
                {
                    status: 404
                }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                {
                    status: 200
                }
            )
        } else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired please signup again to get a new code"
                },
                {
                    status: 400
                }
            )
        }else{
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Verification code"
                },
                {
                    status: 400
                }
            )
        }
    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {
                status: 500
            }
        )
    }
}