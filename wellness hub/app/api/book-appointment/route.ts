import { NextResponse } from "next/server";

let appointments: { doctor: string; date: string; slot: string }[] = [];

export async function POST(req: Request) {
  try {
    // ✅ Ensure JSON parsing
    const body = await req.json();
    const { doctor, date, slot } = body;

    // ✅ Validate input fields
    if (!doctor || !date || !slot) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Store appointment (For now, in memory)
    const newAppointment = { doctor, date, slot };
    appointments.push(newAppointment);

    console.log("Appointments:", appointments); // Debugging log

    return NextResponse.json({ success: true, message: "Appointment booked successfully!", appointment: newAppointment });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
  }
}
