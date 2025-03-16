import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctor");
  const date = searchParams.get("date");

  const availability: Record<string, string[]> = {
    doc1: ["10:00 AM", "11:30 AM", "3:00 PM"],
    doc2: ["9:00 AM", "12:00 PM", "4:00 PM"],
    doc3: ["8:30 AM", "1:00 PM", "5:00 PM"],
  };

  return NextResponse.json(doctorId && doctorId in availability ? availability[doctorId] : []);
}
