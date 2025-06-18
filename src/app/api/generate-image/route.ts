import { NextRequest, NextResponse } from 'next/server'
import { generateImageFromPrompt } from '@/actions/generateImage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, modelId } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const result = await generateImageFromPrompt(prompt, modelId)

    return NextResponse.json({
      imageData: result.imageData,
      modelUsed: result.modelUsed,
      success: true,
    })
  } catch (error) {
    console.error('Failed to generate image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
