import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

export const getGeminiModel = () => {
  if (!API_KEY) return null
  const genAI = new GoogleGenerativeAI(API_KEY)
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}

export const analyzeWatchlist = async (items) => {
  const model = getGeminiModel()
  if (!model) return 'Gemini API key not configured.'

  const movieTitles = items.map(i => `${i.title} (${i.mediaType})`).join(', ')
  const prompt = `I have the following movies and TV shows in my watchlist: ${movieTitles}. 
  Analyze my taste and give me a 2-sentence summary of my current mood based on these titles. 
  Then, suggest one classic movie and one recent hit that I might enjoy, with a very brief reason why. 
  Format as a JSON object with "summary", "classicSuggestion", and "recentSuggestion" keys.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    // Extract JSON if AI wrapped it in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: text }
  } catch (error) {
    console.error('Gemini error:', error)
    return { error: 'Failed to analyze watchlist' }
  }
}
