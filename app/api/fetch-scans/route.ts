import { NextRequest, NextResponse } from "next/server";
import detectionSchema from "@/model/detectionSchema";
import { ConnectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  await ConnectToDatabase();

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authorized" },
        { status: 401 }
      );
    }

    const scans = await detectionSchema.find({ userId });

    return NextResponse.json(
      { message: "Scans fetched successfully", data: scans },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching scans:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
