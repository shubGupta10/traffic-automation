import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDatabase } from '@/lib/db';
import detectionSchema from '@/model/detectionSchema';

export async function POST(req: NextRequest) {
  try {
    await ConnectToDatabase();

    const body = await req.json();
    const {
      userId,
      vehicle_number,
      vehicle_type,
      helmet_detected,
      helmet_detected_image_path,
      number_plate_type,
      image_path,
      location,
      non_helmet_rider,
      non_helmet_rider_image_path,
      passenger_with_helmet,
      passenger_with_helmet_image_path,
      vehicle_speed,
    } = body;

    // Validate required fields
    if (
      !userId ||
      !vehicle_number ||
      !vehicle_type ||
      typeof helmet_detected !== 'boolean' ||
      !number_plate_type ||
      !image_path ||
      !location ||
      typeof non_helmet_rider !== 'boolean' ||
      typeof passenger_with_helmet !== 'boolean'
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newDetection = new detectionSchema({
      userId,
      vehicle_number,
      vehicle_type,
      helmet_detected,
      helmet_detected_image_path,
      number_plate_type,
      image_path,
      location,
      non_helmet_rider,
      non_helmet_rider_image_path,
      passenger_with_helmet,
      passenger_with_helmet_image_path,
      vehicle_speed,
    });

    await newDetection.save();

    return NextResponse.json(
      { message: 'Detection stored successfully', data: newDetection },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to upload data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
