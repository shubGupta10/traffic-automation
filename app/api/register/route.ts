import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import { ConnectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        await ConnectToDatabase();
        const { name, email, password } = await req.json();
        if (!name || !email || !password) {
            return NextResponse.json({
                message: "Please fill all fields"
            }, { status: 400 })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                message: "User already exists"
            }, { status: 400 })
        }

        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            return NextResponse.json({
                message: "Please provide a valid email address"
            }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({
                message: "Password should be at least 6 characters long"
            }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            isAdmin: false,
            password: hashedPassword,
        })

        await user.save();

        return NextResponse.json({
            message: "User created successfully",
            user: user
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}