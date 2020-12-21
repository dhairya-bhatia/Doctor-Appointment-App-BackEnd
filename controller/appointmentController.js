const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var models = require("../models"); // loads index.js
var sendEmail = require("../email/sendEmail");
const Appointment = models.Appointments;
const User = models.User;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getAllAppointmentDetails = async (req, res) => {
  try {
    const rangeStart = req.query.range_start;
    const rangeEnd = req.query.range_end;

    const appointments = await Appointment.findAll({
      where: {
        date: {
          [Op.between]: [rangeStart, rangeEnd],
        },
      },
    });
    let appointmentObj = {};
    appointmentObj.doctorInfo = {};
    appointmentObj.doctorInfo.name = "John Doe";
    appointmentObj.doctorInfo.docDegree = "MBBS, MD (MEDICINE)";
    appointmentObj.doctorInfo.appointmentduration = "1 hr";
    appointmentObj.doctorInfo.hospitalName = "Max Hospital";
    appointmentObj.appointments = appointments;
    return res.status(200).json({ appointmentObj });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addAppointment = async (req, res) => {
  try {
    const appointment = new Appointment({
      timezone: req.body.appointment.timezone,
      slot: req.body.appointment.slot,
      date: req.body.appointment.date,
      patientName: req.body.appointment.patient.patientName,
      patientEmail: req.body.appointment.patient.patientEmail,
      extraNotes: req.body.appointment.patient.extraNotes || null,
    });
    await appointment.save();
    await sendEmail(req.body.appointment);
    return res.status(200).json({ appointment });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//auth related Api calls

const signUpUser = async (req, res) => {
  try {
    const currentUser = await User.findAll({
      where: {
        email: {
          [Op.eq]: req.body.userData.email,
        },
      },
    });
    if (currentUser.length !== 0) {
      return res.status(400).send({ error: "E-mail already exists" });
    }

    //hashing password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.userData.password, salt);
    const user = new User({
      username: req.body.userData.username,
      email: req.body.userData.email,
      password: hashedPassword,
    });
    await user.save();
    const userInfo = { name: req.body.userData.email };
    const accesstoken = jwt.sign(
      { userInfo },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1 day",
      }
    );

    let userData = {
      username: req.body.userData.username,
      email: req.body.userData.email,
      accesstoken,
    };

    return res.status(200).send({ data: userData });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    //   Authenticating User
    const currentUser = await User.findOne({
      raw: true,
      where: {
        email: {
          [Op.eq]: req.body.userData.email,
        },
      },
    });
    if (!currentUser || currentUser.length === 0) {
      res.status(404).send({ error: "User with this email does not exist" });
    }

    // Check password
    let passwordEntered = req.body.userData.password;
    if (await bcrypt.compare(passwordEntered, currentUser.password)) {
      const user = { name: req.body.userData.email };
      const accesstoken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1 day",
      });
      let userData = {
        username: currentUser.username,
        email: currentUser.email,
        accesstoken,
      };

      return res.status(200).send({ data: userData });
    } else {
      return res.status(404).send({ error: "Password is incorrect" });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).send("Forbidden!");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid Token");
    }
    req.user = user;
    next();
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ raw: true });
    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  getAllAppointmentDetails,
  addAppointment,
  signUpUser,
  loginUser,
  authenticateToken,
  getAllUsers,
};
