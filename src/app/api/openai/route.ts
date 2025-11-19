import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  // Check if the request has a valid JSON body
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return new NextResponse("Invalid content type", { status: 400 });
  }

  try {
    // Parse the JSON body to extract the 'query' property
    const requestBody = await request.json();
    const { query } = requestBody;

    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
      model: "openai/gpt-oss-20b",
    });
    return NextResponse.json({
      response: chat_completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    return new NextResponse("Invalid JSON data", { status: 400 });
  }
}
