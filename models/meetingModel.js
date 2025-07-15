import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    medRepId: { type: mongoose.Schema.Types.ObjectId, ref: 'MedRep', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    title: { type: String, required: true },
    description: { type: String },
    meetingDate: { type: Date, required: true },
    duration: { type: Number, default: 30 },
    location: { type: String, required: true },
    meetingType: { type: String, enum: ['In-Person', 'Virtual', 'Phone'], default: 'In-Person' },
    status: { type: String, enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Scheduled' },
    agenda: [String],
    notes: { type: String },
    doctorNotes: { type: String },
    productsDiscussed: [String],
    samplesGiven: [String],
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const meetingModel = mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);
export default meetingModel;