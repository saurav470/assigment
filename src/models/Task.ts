import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
    description: string;
    dueTime: Date;
    status: 'pending' | 'overdue' | 'completed';
}

const taskSchema: Schema = new mongoose.Schema({
    description: { type: String, required: true },
    dueTime: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'overdue', 'completed'], default: 'pending' },
},{
    versionKey: false, // Exclude the __v field
});

export const Task = mongoose.model<ITask>('Task', taskSchema);


