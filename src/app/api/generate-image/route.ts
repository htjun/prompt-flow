import { NextRequest, NextResponse } from 'next/server'
import { generateImageFromPrompt } from '@/actions/generateImage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const imageBase64 = await generateImageFromPrompt(prompt)

    return NextResponse.json({
      imageBase64,
      success: true,
    })
  } catch (error) {
    console.error('Failed to generate image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
