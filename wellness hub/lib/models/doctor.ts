import mongoose, { Schema, Document } from 'mongoose';

interface IDoctor extends Document {
  name: string;
  specialty: string;
  experience: number;
  timeSlots: string[];
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, required: true },
  timeSlots: { type: [String], required: true },
});

const Doctor = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
export default Doctor;