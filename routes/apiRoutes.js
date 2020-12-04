const express = require("express");
const router = express.Router();

const {
  getAllAppointmentDetails,
  addAppointment,
} = require("../controller/appointmentController");

router.get("/getAllAppointments", getAllAppointmentDetails);
router.post("/addAppointment", addAppointment);

module.exports = router;
