import OpenAI from "openai";
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest, res: NextResponse) => {
    const { message } = await req.json()
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: message }],
            model: "gpt-4o",
        });

        const responseContent = completion.choices[0].message.content;
        return new NextResponse(JSON.stringify(responseContent), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("Error during API call:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to get completion from OpenAI", details: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}