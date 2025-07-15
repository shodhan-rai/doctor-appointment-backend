import express from "express";
import {
    loginMedRep,
    getMedRepProfile,
    getAssignedDoctors,
    scheduleMeeting,
    getMedRepMeetings,
    updateMeetingStatus,
    getDashboardStats
} from "../controllers/medRepController.js";
import authMedRep from "../middlewares/authMedRep.js";

const medRepRouter = express.Router();

medRepRouter.post("/login", loginMedRep);
medRepRouter.get("/profile", authMedRep, getMedRepProfile);
medRepRouter.get("/doctors", authMedRep, getAssignedDoctors);
medRepRouter.post("/schedule-meeting", authMedRep, scheduleMeeting);
medRepRouter.get("/meetings", authMedRep, getMedRepMeetings);
medRepRouter.post("/update-meeting", authMedRep, updateMeetingStatus);
medRepRouter.get("/dashboard", authMedRep, getDashboardStats);

export default medRepRouter;