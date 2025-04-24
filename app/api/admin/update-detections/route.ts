import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";
import detectionSchema from "@/model/detectionSchema";

export async function PATCH(req: NextRequest) {
  try {
    await ConnectToDatabase();

    const { id, fields } = await req.json();

    if (!id || !fields) {
      return NextResponse.json({ error: "Missing id or fields to update" }, { status: 400 });
    }

    const updated = await detectionSchema.findByIdAndUpdate(id, fields, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Detection not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Detection updated successfully", data: updated });
  } catch (error) {
    console.error("Error in PATCH request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
