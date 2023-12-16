// Import the Mongoose library
import mongoose, { Schema, Document } from 'mongoose';


interface IUser extends Document {
    Name: string;
    email: string;
    password: string;
    accountType: "Admin" | "Student";
    tasks: mongoose.Types.ObjectId[] | [];
    department?:string;

}

// Define the user schema using the Mongoose Schema constructor
const userSchema: Schema = new mongoose.Schema(
    {
        // Define the name field with type String, required, and trimmed
        Name: {
            type: String,
            required: true,
            trim: true,
        },
        // Define the email field with type String, required, and trimmed
        email: {
            type: String,
            required: true,
            trim: true,
        },

        // Define the password field with type String and required
        password: {
            type: String,
            required: true,
        },
        // Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
        accountType: {
            type: String,
            enum: ["Admin", "Student"],
            required: true,
        },
        tasks: [{
            type: mongoose.Types.ObjectId,
            ref: "Task",
        }],
        department: {
            type: String,

        }


       
    },{
        versionKey: false, // Exclude the __v field
    }
);

// Export the Mongoose model for the user schema, using the name "user"
export const User = mongoose.model<IUser>('user', userSchema);