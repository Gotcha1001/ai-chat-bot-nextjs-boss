import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
    try {
        const { personality, message } = await req.json();

        if (!personality || !message) {
            return NextResponse.json(
                { error: "Personality and message are required" },
                { status: 400 }
            );
        }

        // Define the prompt with the user-specified personality
        const PROMPT = `You are an AI assistant with a personality defined as '${personality}'. Respond to the following message with this personality, maintaining a light-hearted tone, incorporating humor, and ending with a relevant joke or witty remark. Use emojis to enhance the tone. Message: ${message}`;

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo", // Free-tier model
            messages: [
                { role: "user", content: PROMPT },
            ],
        });

        return NextResponse.json(completion.choices[0].message?.content);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}