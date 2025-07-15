import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import medRepModel from "../models/medRepModel.js";
import meetingModel from "../models/meetingModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add Medical Representative
const addMedRep = async (req, res) => {
  try {
    console.log("Add Med Rep route hit"); // Debug log
    console.log("Request body:", req.body); // Debug log
    
    const {
      name,
      email,
      password,
      company,
      territory,
      employeeId,
      specialization,
      phone,
    } = req.body;
    const imageFile = req.file;

    // checking for all data to add med rep
    if (
      !name ||
      !email ||
      !password ||
      !company ||
      !territory ||
      !employeeId ||
      !specialization ||
      !phone
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing med rep password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const medRepData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      company,
      territory,
      employeeId,
      specialization,
      phone,
    };

    const newMedRep = new medRepModel(medRepData);
    await newMedRep.save();
    res.json({ success: true, message: "Medical Representative Added" });
  } catch (error) {
    console.log("Error in addMedRep:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get all Medical Representatives
const allMedReps = async (req, res) => {
  try {
    const medReps = await medRepModel.find({}).select("-password");
    res.json({ success: true, medReps });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Temporary function to create sample meeting for testing
const createSampleMeeting = async (req, res) => {
  try {
    // Get first doctor and med rep
    const doctor = await doctorModel.findOne({});
    const medRep = await medRepModel.findOne({});
    
    if (!doctor || !medRep) {
      return res.json({ success: false, message: "Need at least one doctor and one med rep" });
    }

    const sampleMeeting = new meetingModel({
      medRepId: medRep._id,
      doctorId: doctor._id,
      title: "Product Demo - CardioMax",
      description: "Presentation of new cardiac medication",
      meetingDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      location: "City Hospital",
      meetingType: "In-Person",
      agenda: ["Product presentation", "Clinical data review", "Pricing discussion"]
    });
    
    await sampleMeeting.save();
    res.json({ success: true, message: "Sample meeting created" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  addMedRep,
  allMedReps,
  createSampleMeeting,
};
