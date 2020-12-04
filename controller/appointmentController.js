var models = require("../models"); // loads index.js
var sendEmail = require("../email/sendEmail");
const Appointment = models.Appointments;
var Sequelize = require("sequelize");

const getAllAppointmentDetails = async (req, res) => {
  try {
    const rangeStart = req.query.range_start;
    const rangeEnd = req.query.range_end;

    const Op = Sequelize.Op;

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
    res.status(400).json({ error });
  }
};

const addAppointment = async (req, res) => {
  try {
    console.log(req.body);
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
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = { getAllAppointmentDetails, addAppointment };
