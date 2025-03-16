import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    console.log("User Message:", message); // Debugging log

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }], // ✅ Correct format
        generationConfig: { maxOutputTokens: 100 }, // ✅ Limit response length
      }),
    });

    // ✅ Log raw response before parsing
    const rawText = await response.text();
    console.log("Raw API Response:", rawText);

    // ✅ Handle case where response is empty or invalid
    if (!response.ok) {
      console.error("Gemini API Error:", rawText);
      return NextResponse.json({ error: `Gemini API request failed: ${rawText}` }, { status: response.status });
    }

    const data = JSON.parse(rawText); // Now safely parse JSON
    console.log("Gemini API Parsed Response:", data);

    if (!data?.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      return NextResponse.json({ reply: "Sorry, I couldn't generate a response." });
    }

    return NextResponse.json({ userMessage: message, reply: data.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
