import { NextResponse } from "next/server";

// Temporary in-memory storage (replace with database later)
let doctors: { id: string; name: string; specialty: string; experience: string }[] = [];

export async function POST(req: Request) {
  try {
    const { name, specialty, experience } = await req.json();

    if (!name || !specialty || !experience) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newDoctor = {
      id: `doc${doctors.length + 1}`,
      name,
      specialty,
      experience,
    };

    doctors.push(newDoctor);
    console.log("New Doctor Registered:", newDoctor);

    return NextResponse.json({ success: true, message: "Doctor registered successfully!" });
  } catch (error) {
    console.error("Doctor Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(doctors);
}
