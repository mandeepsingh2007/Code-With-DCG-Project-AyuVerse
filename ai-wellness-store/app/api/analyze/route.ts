import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
    try {
        const { vitalSigns } = await req.json();

        if (!vitalSigns) {
            return NextResponse.json({ error: "No vital signs provided" }, { status: 400 });
        }

        const { heartRate, stressLevel, temperature } = vitalSigns;

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            The user's vital signs are:
            - Heart Rate: ${heartRate} BPM
            - Stress Level: ${stressLevel}
            - Body Temperature: ${temperature}°F
            
            Recommend Ayurvedic products from my Shopify store that can cure these vital signs Only Recommend me products from shopify store only give no details only recommend me products.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({ analysis: responseText }, { status: 200 });

    } catch (error) {
        console.error("Error in /api/analyze:", error);
        return NextResponse.json({ error: "Analyze API failed" }, { status: 500 });
    }
}
