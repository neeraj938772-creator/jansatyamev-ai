import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Error: API key not configured in environment variables." }, { status: 500 });
    }

    const apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await apiRes.json();

    // Agar Google API se koi error aaya ho toh use text ke roop mein dikhayein
    if (!apiRes.ok) {
      return NextResponse.json({ text: `API Error: ${JSON.stringify(data)}` });
    }

    // Gemini API ke alag-alag response formats ko handle karne ke liye safe logic
    const extractedText = 
      data.candidates?.[0]?.content?.parts?.[0]?.text || 
      data.candidates?.[0]?.output || 
      data.text || 
      JSON.stringify(data);

    return NextResponse.json({ text: extractedText });

  } catch (err: any) {
    return NextResponse.json({ text: `Server Error: ${err.message}` }, { status: 500 });
  }
}
