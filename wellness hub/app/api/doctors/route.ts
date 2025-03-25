import { NextResponse } from "next/server";

const doctors = [
  { id: "doc1", name: "Dr. A Sharma", specialty: "Ayurveda Specialist" },
  { id: "doc2", name: "Dr. B Patel", specialty: "Nutritionist" },
  { id: "doc3", name: "Dr. C Singh", specialty: "Yoga & Wellness Coach" },
];

export async function GET() {
  return NextResponse.json(doctors);
}
