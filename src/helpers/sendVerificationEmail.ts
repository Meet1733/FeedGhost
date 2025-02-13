import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificatoinEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try{

    await resend.emails.send({
        from: 'FeedGhost <feedghost@meet1733.me>',
        to: email,
        subject: 'FeedGhost | Verification code',
        react: VerificationEmail({username , otp:verifyCode}),
      });

        return {success: true, message: 'Verification email send successfully'}
    }catch(emailError){
        console.error("Error sending verification email", emailError)
        return {success: false, message: 'Failed to send verification email'}
    }
}