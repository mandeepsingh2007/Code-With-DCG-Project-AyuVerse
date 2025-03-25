import mongoose, { Schema, model, models } from "mongoose";

const appointmentSchema = new Schema({
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: String, required: true },
  slot: { type: String, required: true },
  patientEmail: { type: String, required: true },
});

const Appointment = models.Appointment || model("Appointment", appointmentSchema);

export default Appointment;
