import mongoose from "mongoose";

const medRepSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    company: { type: String, required: true },
    territory: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    assignedDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
    targetMeetings: { type: Number, default: 20 },
    completedMeetings: { type: Number, default: 0 }
});

const medRepModel = mongoose.models.MedRep || mongoose.model("MedRep", medRepSchema);
export default medRepModel;