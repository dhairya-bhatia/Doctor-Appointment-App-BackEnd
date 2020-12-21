const express = require("express");
const router = express.Router();

const {
  getAllAppointmentDetails,
  addAppointment,
  signUpUser,
  loginUser,
  authenticateToken,
  getAllUsers,
} = require("../controller/appointmentController");

router.get(
  "/user/getAllAppointments",
  authenticateToken,
  getAllAppointmentDetails
);
router.post("/user/addAppointment", authenticateToken, addAppointment);
router.post("/user/showAppointments", authenticateToken);

router.use("/user", authenticateToken); //using middleware
router.get("/user", authenticateToken);
router.get("/user/getUsers", authenticateToken, getAllUsers);
//auth related
router.post("/signUp", signUpUser);
router.post("/login", loginUser);

module.exports = router;
