// /api/admin/detections/route.ts
import { NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";
import detectionSchema from "@/model/detectionSchema";

export async function GET() {
  try {
    await ConnectToDatabase();

    const detections = await detectionSchema.find({}, {
      _id: 1,
      userId: 1,
      vehicle_number: 1,
      vehicle_type: 1,
      helmet_detected: 1,
      helmet_detected_image_path: 1, // ✅ Separate image path for helmet_detected
      non_helmet_rider: 1,
      non_helmet_rider_image_path: 1, // ✅ Separate image path for non_helmet_rider
      passenger_with_helmet: 1,
      passenger_with_helmet_image_path: 1, // ✅ Separate image path for passenger_with_helmet
      image_path: 1, // General image path
    });

    return NextResponse.json({ data: detections });
  } catch (error) {
    console.error("Error fetching detections:", error);
    return NextResponse.json({ error: "Error fetching detections" }, { status: 500 });
  }
}
