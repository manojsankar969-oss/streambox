import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const modelName = 'gemini-2.0-flash'

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const userPrompt = (body?.prompt || '').trim()

    if (!userPrompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: modelName })
    const result = await model.generateContent(
      `You are a movie and TV recommendation assistant. Keep response under 120 words.\nUser request: ${userPrompt}`
    )
    const text = result.response.text().trim()

    return NextResponse.json({ text, model: modelName })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Gemini request failed' }, { status: 500 })
  }
}
