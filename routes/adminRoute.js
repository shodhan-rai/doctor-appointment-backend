import express from "express";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  addMedRep,
  allMedReps,
  createSampleMeeting, // Add this
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

// Med Rep routes
adminRouter.post("/add-medrep", authAdmin, upload.single("image"), addMedRep);
adminRouter.post("/all-medreps", authAdmin, allMedReps);

// Test routes
adminRouter.get("/test-medrep", (req, res) => {
  res.json({ success: true, message: "Med rep route working" });
});

adminRouter.post("/create-sample-meeting", authAdmin, createSampleMeeting); // Add this

export default adminRouter;
