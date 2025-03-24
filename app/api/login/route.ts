import { NextResponse, NextRequest } from "next/server";
import User from "@/model/userModel";
import { ConnectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest){
    try {
        await ConnectToDatabase();

        const { email, password } = await req.json();
        if(!email || !password){
            return NextResponse.json({
                message: "Please fill all fields"
            }, { status: 400 })
        }

        const existingUser = await User.findOne({email});
        if(!existingUser){
            return NextResponse.json({
                message: "User does not exist"
            }, { status: 400 })
        }

        if(password.length < 6){
            return NextResponse.json({
                message: "Password should be at least 6 characters long"
            }, { status: 400 })
        }

        const comparePassword = bcrypt.compare(password, existingUser.password);
        if(!comparePassword){
            return NextResponse.json({
                message: "Invalid credentials"
            }, { status: 400 })
        }

        return NextResponse.json({
            message: "Login successful",
            user: existingUser
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}