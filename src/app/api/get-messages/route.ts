import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const _user: User = session?.user as User

    if(!session || !_user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {

        //Aggregation Pipeline
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$message'},
            {$sort: {'message.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$message'}}},
        ]).exec()

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: true,
                    message: user.length === 0 ? "No messages found" : "User not found",
                },
                {
                    status: user.length === 0 ? 200 : 404,
                }
            );
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("An unexpected error occured: ", error)
        return Response.json(
            {
                success: false,
                message: "An unexpected error occured while fetching messages"
            },
            {
                status: 500
            }
        )
    }
}