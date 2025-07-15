import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import medRepModel from "../models/medRepModel.js";
import doctorModel from "../models/doctorModel.js";
import meetingModel from "../models/meetingModel.js";

// Med Rep Login
const loginMedRep = async (req, res) => {
    try {
        const { email, password } = req.body;
        const medRep = await medRepModel.findOne({ email });

        if (!medRep) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, medRep.password);
        if (isMatch) {
            const token = jwt.sign({ id: medRep._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Med Rep Profile
const getMedRepProfile = async (req, res) => {
    try {
        const { medRepId } = req.body;
        const profileData = await medRepModel.findById(medRepId).select("-password");
        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Assigned Doctors - Fixed to return all doctors if no assignments
const getAssignedDoctors = async (req, res) => {
    try {
        const { medRepId } = req.body;
        
        // For now, return all available doctors since assignment system isn't fully implemented
        const doctors = await doctorModel.find({ available: true }).select("-password");
        
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Schedule Meeting
const scheduleMeeting = async (req, res) => {
    try {
        const { medRepId, doctorId, title, description, meetingDate, location, meetingType, agenda } = req.body;

        const meetingData = {
            medRepId,
            doctorId,
            title,
            description,
            meetingDate,
            location,
            meetingType,
            agenda: agenda || []
        };

        const newMeeting = new meetingModel(meetingData);
        await newMeeting.save();

        res.json({ success: true, message: "Meeting scheduled successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Med Rep Meetings
const getMedRepMeetings = async (req, res) => {
    try {
        const { medRepId } = req.body;
        const meetings = await meetingModel.find({ medRepId }).populate('doctorId', 'name speciality image');
        res.json({ success: true, meetings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Meeting Status
const updateMeetingStatus = async (req, res) => {
    try {
        const { meetingId, status, notes, productsDiscussed, samplesGiven } = req.body;
        
        const updateData = { status };
        if (notes) updateData.notes = notes;
        if (productsDiscussed) updateData.productsDiscussed = productsDiscussed;
        if (samplesGiven) updateData.samplesGiven = samplesGiven;

        await meetingModel.findByIdAndUpdate(meetingId, updateData);
        
        // Update completed meetings count if status is completed
        if (status === 'Completed') {
            await medRepModel.findByIdAndUpdate(req.body.medRepId, { $inc: { completedMeetings: 1 } });
        }

        res.json({ success: true, message: "Meeting updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const { medRepId } = req.body;
        
        const totalMeetings = await meetingModel.countDocuments({ medRepId });
        const completedMeetings = await meetingModel.countDocuments({ medRepId, status: 'Completed' });
        const scheduledMeetings = await meetingModel.countDocuments({ medRepId, status: 'Scheduled' });
        
        // Get all available doctors for now (since assignment system isn't fully implemented)
        const totalDoctors = await doctorModel.countDocuments({ available: true });

        const stats = {
            totalMeetings,
            completedMeetings,
            scheduledMeetings,
            totalDoctors
        };

        res.json({ success: true, stats });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginMedRep,
    getMedRepProfile,
    getAssignedDoctors,
    scheduleMeeting,
    getMedRepMeetings,
    updateMeetingStatus,
    getDashboardStats
};