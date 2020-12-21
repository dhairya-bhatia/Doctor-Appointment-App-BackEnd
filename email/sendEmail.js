var nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var handlebars = require("handlebars");
var fs = require("fs");

const sendEmail = (appointment) => {
  var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  var transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    requireTLS: true,
    auth: {
      user: "developerjust1@gmail.com",
      pass: "Qwerty@123",
    },
  });

  readHTMLFile(__dirname + "/emailTemplate.html", function (err, html) {
    var template = handlebars.compile(html);
    var replacements = {
      patientName: appointment.patient.patientName,
      dateOfAppointment: new Date(appointment.date).getDate(),
      monthOfAppointment: new Date(appointment.date).getMonth() + 1,
      yearOfappointment: new Date(appointment.date).getFullYear(),
    };
    var htmlToSend = template(replacements);
    var mailOptions = {
      from: "developerjust1@gmail.com",
      to: appointment.patient.patientEmail,
      subject: "Information regarding appointment booked",
      html: htmlToSend,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

module.exports = sendEmail;
