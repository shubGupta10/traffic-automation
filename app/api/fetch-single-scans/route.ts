import { NextRequest, NextResponse } from "next/server";
import detectionSchema from "@/model/detectionSchema";
import { ConnectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await ConnectToDatabase();
    
    const { scanId } = await req.json();
    
    if (!scanId) {
      return NextResponse.json({
        message: "Scan Id is not found"
      }, { status: 400 });
    }
    
    const scanData = await detectionSchema.findById(scanId);
    
    if (!scanData) {
      return NextResponse.json({
        message: "No scans found"
      }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Successfully fetched Scan Data",
      scanData: scanData
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error fetching scandata:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}