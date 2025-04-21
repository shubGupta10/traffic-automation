import mongoose, { Model, Schema } from "mongoose";

interface Users {
    name: string;
    email: string;
    isAdmin: boolean;
    password: string;
    createdAt: Date;
}

const userSchema = new Schema<Users>({
    name: { type: String },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Please provide a valid email address"] 
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    password: { type: String },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<Users>("User", userSchema);


export default User;
