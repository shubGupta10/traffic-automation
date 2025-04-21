import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";
import User from "@/model/userModel";


export async function POST(req: NextRequest) {
    try {
        await ConnectToDatabase();

        const {userId} = await req.json();
        if(!userId){
            return NextResponse.json({
                message: "User is unauthorized"
            }, {status: 404})
        }

        const foundUser = await User.findById(userId);
        if(!foundUser){
            return NextResponse.json({
                message: "User not found"
            }, {status: 500})
        }

        return NextResponse.json({
            message: "User found",
            currentUser: foundUser
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}