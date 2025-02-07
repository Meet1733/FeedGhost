import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function GET(request:Request) {
    try {
        const { text } = await generateText({
            model: google('gemini-1.5-flash-latest'),
            prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'Ques-1||Ques-2||Ques-3'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
        });      

        return Response.json({
            success: true,
            text
        },
        {
            status: 200
        }
    )
    } catch (error) {
        console.log("Error generating messages from gemini ai")
        return Response.json(
            {
                success: false,
                message: "Error generating messages from gemini ai"
            },
            {
                status: 500
            }
        )
    }
}
