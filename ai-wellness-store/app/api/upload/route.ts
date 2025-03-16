import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "Invalid or missing file" }, { status: 400 });
        }

        // Convert PDF to text
        const buffer = Buffer.from(await file.arrayBuffer());
        const text = new TextDecoder().decode(buffer);

        console.log("Extracted PDF Text:", text); // Debugging log

        // Extract vital signs using regex
        const heartRateMatch = text.match(/Current:\s*(\d+)\s*BPM/i);
        const stressMatch = text.match(/Stress Level:\s*(\w+)/i);
        const tempMatch = text.match(/Body Temperature:\s*([\d.]+)°?F/i);

        const extractedData = {
            heartRate: heartRateMatch ? heartRateMatch[1] : "N/A",
            stressLevel: stressMatch ? stressMatch[1] : "N/A",
            temperature: tempMatch ? tempMatch[1] : "N/A",
        };

        return NextResponse.json({ vitalSigns: extractedData }, { status: 200 });

    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
    }
}
