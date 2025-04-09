import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ Get user input
    const { message } = await req.json(); // Only the user message
    console.log("User Message:", message);

    // ✅ Modify message to guide AI's behavior
    const modifiedMessage = `Act as an Ayurvedic expert and answer this: ${message}`;
    console.log("Modified Message:", modifiedMessage);

    // ✅ API URL for Gemini
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    // ✅ Prepare API request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user", // Only user role allowed
            parts: [{ text: modifiedMessage }], // Use modified message here
          },
        ],
        generationConfig: {
          maxOutputTokens: 200, // Control response length
          temperature: 0.7, // Control creativity
          topP: 0.9, // Control diversity
        },
        safetySettings: [
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ],
      }),
    });

    // ✅ Log raw response for debugging
    const rawText = await response.text();
    console.log("Raw API Response:", rawText);

    // ✅ Handle API errors
    if (!response.ok) {
      console.error("Gemini API Error:", rawText);
      return NextResponse.json(
        { error: `Gemini API request failed: ${rawText}` },
        { status: response.status }
      );
    }

    // ✅ Parse response safely
    const data = JSON.parse(rawText);
    console.log("Gemini API Parsed Response:", data);

    // ✅ Handle empty or invalid response
    if (!data?.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      return NextResponse.json({
        reply: "Sorry, I couldn't generate a response. Please try again.",
      });
    }

    // ✅ Return chatbot response
    return NextResponse.json({
      userMessage: message,
      reply: data.candidates[0].content.parts[0].text,
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
