"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Appointments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Appointments.init(
    {
      timezone: DataTypes.STRING,
      slot: DataTypes.STRING,
      date: DataTypes.DATE,
      patientName: DataTypes.STRING(20),
      patientEmail: DataTypes.STRING(50),
      extraNotes: DataTypes.STRING(500),
    },
    {
      sequelize,
      modelName: "Appointments",
    }
  );
  return Appointments;
};
