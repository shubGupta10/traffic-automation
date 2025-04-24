import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the document
export interface IDetection extends Document {
  userId: string;
  vehicle_number: string;
  vehicle_type: 'Bike' | 'Car' | 'Truck' | string;
  helmet_detected?: boolean;
  helmet_detected_image_path?: string;
  number_plate_type: 'White' | 'Yellow' | 'Red' | 'Green' | 'Black' | string;
  timestamp: Date;
  image_path: string;
  location: string; 
  non_helmet_rider?: boolean;
  non_helmet_rider_image_path?: string;
  passenger_with_helmet?: boolean;
  passenger_with_helmet_image_path?: string;
  vehicle_speed: number;
}

const DetectionSchema: Schema = new Schema<IDetection>(
  {
    userId: {
        type: String,
        required: true,
      },
    vehicle_number: {
      type: String,
      required: true,
    },
    vehicle_type: {
      type: String,
      enum: ['Bike', 'Car', 'Truck'],
      required: true,
    },
    helmet_detected: {
      type: Boolean,
      required: false,
    },
      helmet_detected_image_path: {
        type: String,
        required: true,
      },
    number_plate_type: {
      type: String,
      enum: ['White', 'Yellow', 'Red', 'Green', 'Black'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    image_path: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    non_helmet_rider: {
      type: Boolean,
      required: false,
    },
    non_helmet_rider_image_path: {
      type: String,
      required: true,
    },
    passenger_with_helmet: {
      type: Boolean,
      required: false,
    },
    passenger_with_helmet_image_path: {
      type: String,
      required: true,
    },
    vehicle_speed: {
      type: Number,
      required: false,
    },
  },
  { timestamps: false }
);

export default mongoose.models.Detection ||
  mongoose.model<IDetection>('Detection', DetectionSchema);
